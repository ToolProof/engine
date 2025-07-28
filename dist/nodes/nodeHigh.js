import { calculatorJobs } from '../mocks/calculator.js';
import { NodeBase } from '../types/typesLG.js';
import { AIMessage } from '@langchain/core/messages';
import axios from 'axios';
import WebSocket from 'ws';
// ATTENTION_RONAK: NodeHigh is responsible for executing jobs in a workflow. For each job it runs, it expands inputMaps to include the outputs the job produces. Later, it will be implemented to also write the job's metadata in GraphState for use in subsequent conditional steps of the workflow. edgeRouting will then be used to determine the next step based on this metadata.
export class NodeHigh extends NodeBase {
    constructor() {
        super();
    }
    async invoke(state, options) {
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
            // ATTENTION_RONAK: We're asserting that the step is an ActualWorkflowStep for now. NodeHigh is currently not implemented to handle workflows with conditional steps.
            const workflowStepUnion = state.workflowSpec.workflow.steps[state.workflowSpec.counter];
            const actualWorkflowStep = workflowStepUnion;
            const workflowStep = actualWorkflowStep.step;
            const job = calculatorJobs.get(workflowStep.jobId);
            if (!job) {
                throw new Error(`Job with ID ${workflowStep.jobId} not found`);
            }
            // Iterate over the Job's inputs and add them to the payload with paths from state.workflowSpec.inputMaps[0] that match input.role.name's entry in dataExchanges. This means that we should grab the sourceOutput that matches where input.role.name is the targetInput in dataExchanges and then use sourceOut to extract the path from state.workflowSpec.inputMaps[0].
            const dataExchanges = workflowStep.dataExchanges;
            let payload = {};
            job.syntacticSpec.inputs.forEach((input) => {
                const matchingExchange = dataExchanges.find(de => de.targetInput === input.role.name);
                if (matchingExchange) {
                    payload[input.role.name] = state.workflowSpec.inputMaps[0][matchingExchange.sourceOutput];
                }
            });
            console.log('payload:', JSON.stringify(payload, null, 2));
            const foo = async (url) => {
                const response = await axios.post(url, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 30 * 60 * 1000, // 30 minutes in milliseconds
                });
                const result = response.data;
                console.log('result:', JSON.stringify(result, null, 2));
                return result.outputs;
            };
            const outputs = await foo(job.url);
            const outputBindings = workflowStep.outputBindings;
            // Create new entries for inputMaps[0] based on outputBindings
            const newInputMapEntries = {};
            // Map job output roles to bound keys using the result paths
            Object.entries(outputBindings).forEach(([outputRole, boundKey]) => {
                if (outputs[outputRole]) {
                    newInputMapEntries[boundKey] = outputs[outputRole];
                }
            });
            return {
                messages: [new AIMessage('NodeHigh completed')],
                workflowSpec: {
                    ...state.workflowSpec,
                    inputMaps: [
                        {
                            ...state.workflowSpec.inputMaps[0],
                            ...newInputMapEntries
                        },
                        ...state.workflowSpec.inputMaps.slice(1)
                    ],
                    counter: state.workflowSpec.counter + 1
                },
            };
        }
        catch (error) {
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
