import dotenv from 'dotenv';
dotenv.config();
import { calculatorWorkflowSpec_1, calculatorWorkflowSpec_2 } from '../mocks/calculator.js';
import { adapterAutodockWorkflowSpec_1 } from '../mocks/adapter_autodock.js';
import { WorkflowSpec } from '../types/typesWF.js';
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

// ATTENTION_RONAK: Try overwriting the inputMaps in the workflowSpec to test different inputs.
const calculatorWorkflowSpec_1b: WorkflowSpec = {
    ...calculatorWorkflowSpec_1,
    resourceMaps: [
        {
            num_alpha: {
                path: 'calculator/_inputs/num_4.json',
                metadata: {}
            },
            num_beta: {
                path: 'calculator/_inputs/num_7.json',
                metadata: {}
            },
            num_gamma: {
                path: 'calculator/_inputs/num_4.json',
                metadata: {}
            },
            num_delta: {
                path: 'calculator/_inputs/num_9.json',
                metadata: {}
            }
        },
    ],
}

const calculatorWorkflowSpec_2b: WorkflowSpec = {
    ...calculatorWorkflowSpec_2,
    resourceMaps: [
        {
            num_alpha: {
                path: 'calculator/_inputs/num_7.json',
                metadata: {}
            }
        },
    ],
}

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
                workflowSpec: adapterAutodockWorkflowSpec_1,
            }, {
                configurable: { thread_id: thread.thread_id },
                signal: controller.signal,
            });

            // console.log('threadId:', thread.thread_id);
            console.log('result:', JSON.stringify(result.messages, null, 2));

            return result;

        } finally {
            clearTimeout(timeout);
            if (!controller.signal.aborted) {
                controller.abort();
            }
        }

    } catch (error) {
        console.error('Error invoking graph:', error);
    }

}
