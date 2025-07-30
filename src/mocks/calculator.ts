import { RT, RR } from './registries.js';
import { Job, Workflow, WorkflowSpec } from '../types/typesWF.js';
import { v4 as uuidv4 } from 'uuid';

// ATTENTION_RONAK: In this module, jobs and workflows for calculator are hardcoded for demonstration purposes. Later, UI/AI-agent + validator will take care of this. With a small exception (mentioned below), you don't need to do anything here. I'm guiding you here just for your understanding.
// NB: The calculator is just a mock to test the workflow engine as it's very easy to check the results of the jobs. No one would implement a calculator like this.

// Choose where to run the jobs
const prefixCloudRun = 'https://calculator-384484325421.europe-west2.run.app/';
const prefixKubernetes = 'http://34.88.173.92/'; // ATTENTION_RONAK_2: this isn't working yet, so please look into it. It might be because of authentication issues with the Kubernetes cluster.
const prefix = prefixCloudRun;

export const calculatorJobs: Map<string, Job> = new Map([
    ['add_numbers', {
        id: 'add_numbers',
        name: 'add_numbers',
        url: `${prefix}/add_numbers`,
        semanticSpec: {
            description: 'Add two numbers together.',
            embedding: []
        },
        syntacticSpec: {
            inputs: [
                {
                    type: RT('number'),
                    role: RR('addend_1')
                },
                {
                    type: RT('number'),
                    role: RR('addend_2')
                }
            ],
            outputs: [
                {
                    type: RT('number'),
                    role: RR('sum')
                }
            ]
        },
        metadata: [
            {
                // ATTENTION_RONAK: the job hereby specifies that the output sum will contain the result of the addition and the inputs used. NodeHigh will write this to GraphState so that it can be used in conditions in subsequent steps of the workflow. For example, you can use this to check if the sum is greater than a certain value and then decide whether to proceed with the next step or not.
                output: 'sum',
                metadata: {
                    result: 'number',
                    inputs: ['number', 'number']
                }
            }
        ]
    }],
    ['subtract_numbers', {
        id: 'subtract_numbers',
        name: 'subtract_numbers',
        url: `${prefix}/subtract_numbers`,
        semanticSpec: {
            description: 'Subtract one number from another.',
            embedding: []
        },
        syntacticSpec: {
            inputs: [
                {
                    type: RT('number'),
                    role: RR('minuend')
                },
                {
                    type: RT('number'),
                    role: RR('subtrahend')
                }
            ],
            outputs: [
                {
                    type: RT('number'),
                    role: RR('difference')
                }
            ]
        },
        metadata: [
            {
                output: 'difference',
                metadata: {
                    result: 'number',
                    inputs: ['number', 'number']
                }
            }
        ]
    }],
    ['multiply_numbers', {
        id: 'multiply_numbers',
        name: 'multiply_numbers',
        url: `${prefix}/multiply_numbers`,
        semanticSpec: {
            description: 'Multiply two numbers together.',
            embedding: []
        },
        syntacticSpec: {
            inputs: [
                {
                    type: RT('number'),
                    role: RR('multiplicand')
                },
                {
                    type: RT('number'),
                    role: RR('multiplier')
                }
            ],
            outputs: [
                {
                    type: RT('number'),
                    role: RR('product')
                }
            ]
        },
        metadata: [
            {
                output: 'product',
                metadata: {
                    result: 'number',
                    inputs: ['number', 'number']
                }
            }
        ]
    }],
    ['divide_numbers', {
        id: 'divide_numbers',
        name: 'divide_numbers',
        url: `${prefix}/divide_numbers`,
        semanticSpec: {
            description: 'Divide one number by another.',
            embedding: []
        },
        syntacticSpec: {
            inputs: [
                {
                    type: RT('number'),
                    role: RR('dividend')
                },
                {
                    type: RT('number'),
                    role: RR('divisor')
                }
            ], // ATTENTION: division by zero
            outputs: [
                {
                    type: RT('number'),
                    role: RR('quotient')
                }
            ]
        },
        metadata: [
            {
                output: 'quotient',
                metadata: {
                    result: 'number',
                    inputs: ['number', 'number']
                }
            }
        ]
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

export const calculatorWorkflowSpec_1: WorkflowSpec = {
    workflow: calculatorWorkflow_1,
    // external
    resourceMaps: [
        {
            num_alpha: {
                path: 'calculator/_inputs/num_1.json',
                metadata: {}
            },
            num_beta: {
                path: 'calculator/_inputs/num_2.json',
                metadata: {}
            },
            num_gamma: {
                path: 'calculator/_inputs/num_4.json',
                metadata: {}
            },
            num_delta: {
                path: 'calculator/_inputs/num_5.json',
                metadata: {}
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
                left: 'sum',
                right: 50
            }
        }
    ]
}


export const calculatorWorkflowSpec_2: WorkflowSpec = {
    workflow: calculatorWorkflow_2,
    // external
    resourceMaps: [
        {
            num_alpha: {
                path: 'calculator/_inputs/num_6.json',
                metadata: {}
            }
        },
    ],
    counter: 0
};