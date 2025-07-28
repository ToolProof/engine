import dotenv from 'dotenv';
dotenv.config();
import { calculatorWorkflow_1 } from '../mocks/calculator.js';
import { adapterAutodockWorkflow_1 } from '../mocks/adapter_autodock.js';
import { Client } from '@langchain/langgraph-sdk';
import { RemoteGraph } from '@langchain/langgraph/remote';
import { HumanMessage } from '@langchain/core/messages';
const urlLocal = `http://localhost:8123`;
const urlRemote = `https://deployment-typescript-48b9b40b9bac500f8fe557700e4c49d9.us.langgraph.app`;
const url = urlLocal; //process.env.URL || urlLocal;
const graphId = 'workflowRunner';
const client = new Client({
    apiUrl: url,
});
const remoteGraph = new RemoteGraph({ graphId, url });
// ATTENTION_RONAK: The calculatorWorkflowSpec and adapterAutodockWorkflowSpec are used to define the initial inputs to the workflows that will be run by the clientWorkflowRunner. These workflows are defined in the mocks/calculator.ts and mocks/adapter_autodock.ts files respectively. Later, UI/AI-agent + validator will take care of this. You don't need to do anything here. I'm guiding you here just for your understanding.
// You can actually run this workflow with 'npm run start:workflowRunner' (remember to deploy the workflowRunner graph locally first) and check the final result in tp_resources/calculator/multiply_numbers (as multiply_numbers is the last job in adapterAutodockWorkflow_1).
// Can you guess what the final result will be?
const calculatorWorkflowSpec = {
    workflow: calculatorWorkflow_1,
    // start_job
    inputMaps: [
        {
            'num_alpha': 'calculator/_inputs/num_2.json',
            'num_beta': 'calculator/_inputs/num_8.json',
            'num_gamma': 'calculator/_inputs/num_6.json',
            'num_delta': 'calculator/_inputs/num_3.json'
        },
    ],
    counter: 0
};
// ATTENTION_RONAK: This workflow can't be run yet, as edgeRouting and NodeHigh are not yet implemented for workflows with conditional steps.
const adapterAutodockWorkflowSpec = {
    workflow: adapterAutodockWorkflow_1,
    // start_job
    inputMaps: [
        {
            'ligand': 'adapter_autodock/_inputs/ligand.smi',
            'receptor': 'adapter_autodock/_inputs/receptor.pdb',
            'box': 'adapter_autodock/_inputs/box.pdb'
        },
    ],
    counter: 0
};
export async function runRemoteGraph() {
    try {
        // Create a thread (or use an existing thread instead)
        const thread = await client.threads.create();
        // console.log('thread :', thread);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1800000); // 30 minutes
        // console.log('timeout :', timeout);
        try {
            // console.log('Invoking the graph')
            const result = await remoteGraph.invoke({
                messages: [new HumanMessage('Graph is invoked')],
                dryModeManager: {
                    dryRunMode: false,
                    delay: 1000,
                    drySocketMode: true,
                },
                workflowSpec: calculatorWorkflowSpec,
            }, {
                configurable: { thread_id: thread.thread_id },
                signal: controller.signal,
            });
            // console.log('threadId:', thread.thread_id);
            console.log('result:', JSON.stringify(result.messages, null, 2));
            return result;
        }
        finally {
            clearTimeout(timeout);
            if (!controller.signal.aborted) {
                controller.abort();
            }
        }
    }
    catch (error) {
        console.error('Error invoking graph:', error);
    }
}
