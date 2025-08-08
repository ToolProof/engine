import { calculatorJobs } from '../mocks/calculator.js';
import { adapterAutodockJobs } from '../mocks/adapter_autodock.js';
import { bar } from '../lib/ajvWrapper.js';
import { NodeBase, GraphState } from '../types/typesLG.js';
import { ExtractedData, ResourceMap } from '../types/typesWF.js';
import { RunnableConfig } from '@langchain/core/runnables';
import { AIMessage } from '@langchain/core/messages';
import axios from 'axios';

export class NodeHigh extends NodeBase {

    constructor() {
        super('NodeHigh'); // Pass node name to base class
    }

    // Implement the specific business logic for NodeHigh
    protected async executeNode(state: GraphState, options?: Partial<RunnableConfig<Record<string, any>>>): Promise<Partial<GraphState>> {
        try {
            const workflowStep = state.workflowSpec.workflow.steps[state.workflowSpec.counter];

            //  Currently, NodeHigh is hardcoded to only handle calculatorJobs and adapterAutodockJobs.
            const availableJobs = new Map([...calculatorJobs, ...adapterAutodockJobs]);
            const job = availableJobs.get(workflowStep.jobId);

            if (!job) {
                throw new Error(`Job with ID ${workflowStep.jobId} not found`);
            }

            // ATTENTION_RONAK: Here, we iterate over the job's specified inputs, and for each of them we find an matching entry in jobInputs. We then use matchingInput.alias to extract the filepath from state.workflowSpec.resourceMaps[0].

            const inputBindings = workflowStep.inputBindings;

            let payload: { [key: string]: string } = {};

            job.resources.inputs.forEach((input) => {
                const matchingInput = inputBindings[input.name];
                if (matchingInput) {

                    if (state.workflowSpec.resourceMaps[0][matchingInput]) {
                        payload[input.name] = state.workflowSpec.resourceMaps[0][matchingInput].path;
                    } else {
                        payload[input.name] = 'calculator/_inputs/num_1.json'; // ATTENTION_RONAK_#: For now, we use this as a placeholder. Later, the workflow engine will request an external input if the input is not found in resourceMaps[0].
                    }
                }
            });

            // console.log('payload:', JSON.stringify(payload, null, 2));

            const foo = async (url: string): Promise<{ [key: string]: { path: string, extractedData?: ExtractedData } }> => {

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

                // console.log('result:', JSON.stringify(result, null, 2));

                return result.outputs;
            }

            const outputs = await foo(job.url);


            // Here, for each output we must invoke the respective ResourceType's extractor job
            await Promise.all(Object.entries(outputs).map(async ([outputRole, output]) => {

                const extractedData = await bar(output.path);

                // Merge the extracted data with the output
                outputs[outputRole] = {
                    ...output,
                    extractedData: extractedData as ExtractedData
                };

            }));

            // Now outputs has the extractedData property added

            const outputBindings = workflowStep.outputBindings;

            // Create new entries for resourceMaps[0] based on outputBindings
            const newResourceMapEntries: ResourceMap = {};

            // Map job output roles to bound keys using the result paths
            // ATTENTION: This is vulnerable if outputBindings are not specified. Should default to original output role names.
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



