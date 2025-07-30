import { calculatorJobs } from '../mocks/calculator.js';
import { NodeBase, GraphState } from '../types/typesLG.js';
import { ResourceMap } from '../types/typesWF.js';
import { RunnableConfig } from '@langchain/core/runnables';
import { AIMessage } from '@langchain/core/messages';
import axios from 'axios';
import WebSocket from 'ws';


// ATTENTION_RONAK: NodeHigh is responsible for executing jobs in a workflow. For each job it runs, it expands resourceMaps to include the outputs the job produces. Later, it will be implemented to also write the job's metadata in GraphState for use in subsequent conditional steps of the workflow. edgeRouting will then be used to determine the next step based on this metadata.

export class NodeHigh extends NodeBase {

    constructor() {
        super();
    }

    async invoke(state: GraphState, options?: Partial<RunnableConfig<Record<string, any>>>): Promise<Partial<GraphState>> {

        if (!state.dryModeManager.drySocketMode) {

            // Connect to WebSocket server
            const ws = new WebSocket('https://service-websocket-384484325421.europe-west2.run.app');

            ws.on('open', () => {
                ws.send(JSON.stringify({
                    node: 'NodeHigh',
                }));
                ws.close();
            });

            ws.on('error', (error) => {
                console.error('WebSocket Error:', error);
            });
        }

        if (state.dryModeManager.dryRunMode) {
            await new Promise(resolve => setTimeout(resolve, state.dryModeManager.delay));

            return {
                messages: [new AIMessage('NodeHigh completed in DryRun mode')],
            };
        }

        try {
            const workflowStep = state.workflowSpec.workflow.steps[state.workflowSpec.counter];

            // ATTENTION_RONAK: NodeHigh is currently hardcoded to use calculatorJobs.
            const job = calculatorJobs.get(workflowStep.jobId);

            if (!job) {
                throw new Error(`Job with ID ${workflowStep.jobId} not found`);
            }

            // ATTENTION_RONAK: Here, we iterate over the job's specified inputs, and for each of them we find an matching entry in jobInputs. We then use matchingInput.alias to extract the filepath from state.workflowSpec.resourceMaps[0].

            const inputBindings = workflowStep.inputBindings;

            let payload: { [key: string]: string } = {};

            job.syntacticSpec.inputs.forEach((input) => {
                const matchingInput = inputBindings[input.role.name];
                if (matchingInput) {

                    if (state.workflowSpec.resourceMaps[0][matchingInput]) {
                        payload[input.role.name] = state.workflowSpec.resourceMaps[0][matchingInput].path;
                    } else {
                        payload[input.role.name] = 'calculator/_inputs/num_1.json'; // ATTENTION_RONAK: For now, we use this as a placeholder. Later, the workflow engine will request an external input if the input is not found in resourceMaps[0].
                    }
                }
            });

            console.log('payload:', JSON.stringify(payload, null, 2));

            const foo = async (url: string): Promise<{ [key: string]: { path: string, metadata: any } }> => {

                const response = await axios.post(
                    url,
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        timeout: 30 * 60 * 1000, // 30 minutes in milliseconds
                    }
                );

                const result = response.data;

                console.log('result:', JSON.stringify(result, null, 2));

                return result.outputs;
            }

            const outputs = await foo(job.url);

            const outputBindings = workflowStep.outputBindings;

            // Create new entries for resourceMaps[0] based on outputBindings
            const newResourceMapEntries: ResourceMap = {};

            // Map job output roles to bound keys using the result paths
            Object.entries(outputBindings).forEach(([outputRole, boundKey]) => {
                if (outputs[outputRole]) {
                    newResourceMapEntries[boundKey] = outputs[outputRole];
                }
            });

            return {
                messages: [new AIMessage('NodeHigh completed')],
                workflowSpec: {
                    ...state.workflowSpec,
                    resourceMaps: [
                        {
                            ...state.workflowSpec.resourceMaps[0],
                            ...newResourceMapEntries
                        },
                        ...state.workflowSpec.resourceMaps.slice(1)
                    ],
                    // We update the counter only if the step does not have a whileLoopCondition. If it does, we keep the counter the same so that the loop can continue.
                    counter: workflowStep.whileLoopCondition ? state.workflowSpec.counter : state.workflowSpec.counter + 1
                },
            };

        } catch (error: any) {
            console.error('Error in NodeHigh:', error);
            return {
                messages: [new AIMessage('NodeHigh failed')],
                workflowSpec: {
                    ...state.workflowSpec,
                    counter: state.workflowSpec.counter + 1
                },
            };
        }
    }

}



