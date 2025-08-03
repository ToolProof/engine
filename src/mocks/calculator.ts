import { RT, RR } from './registries.js';
import { Job, Workflow, WorkflowSpec, ResourceRole } from '../types/typesWF.js';
import { v4 as uuidv4 } from 'uuid';

// ATTENTION_RONAK: In this module, jobs and workflows for calculator are hardcoded for demonstration purposes. Later, UI/AI-agent + validator will take care of this. You don't need to do anything here. I'm guiding you here just for your understanding.
// NB: The calculator is just a mock to test the workflow engine as it's very easy to check the results of the jobs. No one would implement a calculator like this.

// Choose where to run the jobs
const prefixCloudRun = 'https://calculator-384484325421.europe-west2.run.app/';
const prefixKubernetes = 'http://34.88.173.92';
const prefix = prefixKubernetes;


const testInput: ResourceRole = RR('addend_1', RT('number'));

const testType = testInput.type;

export const calculatorJobs: Map<string, Job> = new Map([
    ['add_numbers', {
        id: 'add_numbers',
        name: 'add_numbers',
        description: 'Add two numbers together.',
        url: `${prefix}/add_numbers`,
        resources: {
            inputs: [
                RR('addend_1', RT('number')),
                RR('addend_2', RT('number'))
            ],
            outputs: [
                RR('sum', RT('number')),
            ]
        },
    }],
    ['subtract_numbers', {
        id: 'subtract_numbers',
        name: 'subtract_numbers',
        description: 'Subtract one number from another.',
        url: `${prefix}/subtract_numbers`,
        resources: {
            inputs: [
                RR('minuend', RT('number')),
                RR('subtrahend', RT('number'))
            ],
            outputs: [
                RR('difference', RT('number')),
            ]
        },
    }],
    ['multiply_numbers', {
        id: 'multiply_numbers',
        name: 'multiply_numbers',
        description: 'Multiply two numbers together.',
        url: `${prefix}/multiply_numbers`,
        resources: {
            inputs: [
                RR('multiplicand', RT('number')),
                RR('multiplier', RT('number'))
            ],
            outputs: [
                RR('product', RT('number')),
            ]
        },
    }],
    ['divide_numbers', {
        id: 'divide_numbers',
        name: 'divide_numbers',
        description: 'Divide one number by another.',
        url: `${prefix}/divide_numbers`,
        resources: {
            inputs: [
                RR('dividend', RT('number')),
                RR('divisor', RT('number'))
            ],
            outputs: [
                RR('quotient', RT('number')),
            ]
        },
    }]
])


const calculatorWorkflow_1: Workflow = {
    id: 'calculator_workflow_1',
    steps: [
        // Use two external numbers in addition
        {
            id: uuidv4(),
            jobId: 'add_numbers',
            inputBindings: {
                addend_1: 'num_alpha',
                addend_2: 'num_beta'
            },
            outputBindings: {
                sum: 'sum_1'
            }
        },
        // Use sum_1 from the previous step in addition with an external number
        {
            id: uuidv4(),
            jobId: 'add_numbers',
            inputBindings: {
                addend_1: 'sum_1',
                addend_2: 'num_gamma'
            },
            outputBindings: {
                sum: 'sum_2'
            }
        },
        // Use sum_2 from the previous step in multiplication with an external number
        {
            id: uuidv4(),
            jobId: 'multiply_numbers',
            inputBindings: {
                multiplicand: 'sum_2',
                multiplier: 'num_delta'
            },
            outputBindings: {
                product: 'product'
            }
        }
    ]
}


// ATTENTION_RONAK: calculatorWorkflowSpec is used to define the initial inputs to the workflow that will be run by the clientWorkflowRunner. Later, UI/AI-agent + validator will take care of this. You don't need to do anything here. I'm guiding you here just for your understanding.

// You can actually run this workflow with 'npm run start:workflowRunner' (remember to deploy the workflowRunner graph locally first) and check the final result in tp_resources/calculator/multiply_numbers (as multiply_numbers is the last job in calculatorWorkflow_1).
// Can you guess what the final result will be?

// ATTENTION_RONAK_#: The compiler output should look like this (including the workflow itself of course):

export const calculatorWorkflowSpec_1: WorkflowSpec = {
    workflow: calculatorWorkflow_1,
    // Initial inputs for the workflow
    resourceMaps: [
        {
            num_alpha: {
                path: 'calculator/_inputs/num_1.json',
                extractedData: {}
            },
            num_beta: {
                path: 'calculator/_inputs/num_2.json',
                extractedData: {}
            },
            num_gamma: {
                path: 'calculator/_inputs/num_4.json',
                extractedData: {}
            },
            num_delta: {
                path: 'calculator/_inputs/num_5.json',
                extractedData: {}
            }
        },
    ],
    counter: 0
};


const calculatorWorkflow_2: Workflow = {
    id: 'calculator_workflow_2',
    steps: [
        // Initially, use two numbers from outside in addition, then use the result in a while loop to keep adding numbers until the sum is greater than 30.
        {
            id: uuidv4(),
            jobId: 'add_numbers',
            inputBindings: {
                // For the first iteration, since 'sum' does not exist in resourceMaps[0], the workflow engine will fall back to requesting an external input.
                addend_1: 'sum',
                addend_2: 'num_alpha'
            },
            outputBindings: {
                sum: 'sum'
            },
            whileLoopCondition: {
                op: 'less_than',
                resource: 'sum',
                variable: 'result',
                value: 50
            }
        }
    ]
}


export const calculatorWorkflowSpec_2: WorkflowSpec = {
    workflow: calculatorWorkflow_2,
    // Initial inputs for the workflow
    resourceMaps: [
        {
            num_alpha: {
                path: 'calculator/_inputs/num_6.json',
                extractedData: {}
            }
        },
    ],
    counter: 0
};