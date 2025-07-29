import { RT, RR } from './registries.js';
import { Job, Workflow } from '../types/typesWF.js';
import { v4 as uuidv4 } from 'uuid';

// ATTENTION_RONAK: In this module, jobs and workflows for calculator are hardcoded for demonstration purposes. Later, UI/AI-agent + validator will take care of this. With a small exception (mentioned below), you don't need to do anything here. I'm guiding you here just for your understanding.
// NB: The calculator is just a mock to test the workflow engine as it's very easy to check the results of the jobs. No one would implement a calculator like this.

// Choose where to run the jobs
const prefixCloudRun = 'https://calculator-384484325421.europe-west2.run.app/';
const prefixKubernetes = 'http://34.88.173.92'; // ATTENTION_RONAK_2: this isn't working yet, so please look into it. It might be because of authentication issues with the Kubernetes cluster.
const prefix = prefixKubernetes;

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


export const calculatorWorkflow_1: Workflow = {
    id: 'calculator_workflow_1',
    steps: [
        // Step 1: Initial addition from start_job
        {
            type: 'actual',
            step: {
                id: uuidv4(),
                jobId: 'add_numbers',
                dataExchanges: [
                    { sourceJobId: 'start_job', sourceOutput: 'num_alpha', targetJobId: 'add_numbers', targetInput: 'addend_1' },
                    { sourceJobId: 'start_job', sourceOutput: 'num_beta', targetJobId: 'add_numbers', targetInput: 'addend_2' }
                ],
                outputBindings: {
                    sum: 'sum_1'
                }
            }
        },
        // Step 2: Use sum_1 in another addition (simulated loop)
        {
            type: 'actual',
            step: {
                id: uuidv4(),
                jobId: 'add_numbers',
                dataExchanges: [
                    { sourceJobId: 'add_numbers', sourceOutput: 'sum_1', targetJobId: 'add_numbers', targetInput: 'addend_1' },
                    { sourceJobId: 'start_job', sourceOutput: 'num_gamma', targetJobId: 'add_numbers', targetInput: 'addend_2' }
                ],
                outputBindings: {
                    sum: 'sum_2'
                }
            }
        },
        // Step 3: Final multiplication using sum_2 as multiplicand
        {
            type: 'actual',
            step: {
                id: uuidv4(),
                jobId: 'multiply_numbers',
                dataExchanges: [
                    { sourceJobId: 'add_numbers', sourceOutput: 'sum_2', targetJobId: 'multiply_numbers', targetInput: 'multiplicand' },
                    { sourceJobId: 'start_job', sourceOutput: 'num_delta', targetJobId: 'multiply_numbers', targetInput: 'multiplier' }
                ],
                outputBindings: {
                    product: 'product'
                }
            }
        }
    ]
}