import { RT, RR } from './registries.js';
import { v4 as uuidv4 } from 'uuid';
export const numericalJobs = new Map([
    ['add_numbers', {
            id: 'add_numbers',
            name: 'add_numbers',
            url: 'https://dummy-url.com/add_numbers',
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
            }
        }],
    ['subtract_numbers', {
            id: 'subtract_numbers',
            name: 'subtract_numbers',
            url: 'https://dummy-url.com/subtract_numbers',
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
            }
        }],
    ['multiply_numbers', {
            id: 'multiply_numbers',
            name: 'multiply_numbers',
            url: 'https://dummy-url.com/multiply_numbers',
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
            }
        }],
    ['divide_numbers', {
            id: 'divide_numbers',
            name: 'divide_numbers',
            url: 'https://dummy-url.com/divide_numbers',
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
            }
        }]
]);
/* export const numericalWorkflow_1: Workflow = {
    id: 'numerical_workflow_1',
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
                    sum: 'sum'
                }
            }
        },

        // Step 2: Parallel block using output from step 1 (sum)
        {
            type: 'parallel',
            branches: [
                // Branch 1: multiply sum with 2
                [
                    {
                        type: 'actual',
                        step: {
                            id: uuidv4(),
                            jobId: 'multiply_numbers',
                            dataExchanges: [
                                { sourceJobId: 'add_numbers', sourceOutput: 'sum', targetJobId: 'multiply_numbers', targetInput: 'multiplicand' },
                                { sourceJobId: 'start_job', sourceOutput: 'two', targetJobId: 'multiply_numbers', targetInput: 'multiplier' }
                            ],
                            outputBindings: {
                                product: 'product'
                            }
                        }
                    }
                ],
                // Branch 2: reuse sum in another addition
                [
                    {
                        type: 'actual',
                        step: {
                            id: uuidv4(),
                            jobId: 'add_numbers',
                            dataExchanges: [
                                { sourceJobId: 'add_numbers', sourceOutput: 'sum', targetJobId: 'add_numbers', targetInput: 'addend_1' },
                                { sourceJobId: 'start_job', sourceOutput: 'num_gamma', targetJobId: 'add_numbers', targetInput: 'addend_2' }
                            ],
                            outputBindings: {
                                sum: 'sum'
                            }
                        }
                    }
                ]
            ]
        },

        // Step 3: Use product in another addition (simulated loop)
        {
            type: 'actual',
            step: {
                id: uuidv4(),
                jobId: 'add_numbers',
                dataExchanges: [
                    { sourceJobId: 'multiply_numbers', sourceOutput: 'product', targetJobId: 'add_numbers', targetInput: 'addend_1' },
                    { sourceJobId: 'start_job', sourceOutput: 'num_delta', targetJobId: 'add_numbers', targetInput: 'addend_2' }
                ],
                outputBindings: {
                    sum: 'sum'
                }
            }
        },

        // Step 4: Final multiplication using last sum as multiplicand
        {
            type: 'actual',
            step: {
                id: uuidv4(),
                jobId: 'multiply_numbers',
                dataExchanges: [
                    { sourceJobId: 'multiply_numbers', sourceOutput: 'product', targetJobId: 'multiply_numbers', targetInput: 'multiplicand' },
                    { sourceJobId: 'start_job', sourceOutput: 'ten', targetJobId: 'multiply_numbers', targetInput: 'multiplier' }
                ],
                outputBindings: {
                    product: 'product'
                }
            }
        }
    ]
} */
/* export const numericalWorkflow_2: Workflow = {
    id: 'numerical_workflow_2',
    steps: [
        {
            type: 'parallel',
            branches: [
                [
                    {
                        type: 'actual',
                        step: {
                            id: uuidv4(),
                            jobId: 'add_numbers',
                            dataExchanges: [
                                { sourceJobId: 'start_job', sourceOutput: 'a1', targetJobId: 'add_numbers', targetInput: 'addend_1' },
                                { sourceJobId: 'start_job', sourceOutput: 'a2', targetJobId: 'add_numbers', targetInput: 'addend_2' }
                            ],
                            outputBindings: {
                                sum: 'sum_A'
                            }
                        }
                    }
                ],
                [
                    {
                        type: 'actual',
                        step: {
                            id: uuidv4(),
                            jobId: 'add_numbers',
                            dataExchanges: [
                                { sourceJobId: 'start_job', sourceOutput: 'b1', targetJobId: 'add_numbers', targetInput: 'addend_1' },
                                { sourceJobId: 'start_job', sourceOutput: 'b2', targetJobId: 'add_numbers', targetInput: 'addend_2' }
                            ],
                            outputBindings: {
                                sum: 'sum_B'
                            }
                        }
                    }
                ]
            ]
        },
        {
            type: 'actual',
            step: {
                id: uuidv4(),
                jobId: 'multiply_numbers',
                dataExchanges: [
                    { sourceJobId: 'add_numbers', sourceOutput: 'sum_A', targetJobId: 'multiply_numbers', targetInput: 'multiplicand' },
                    { sourceJobId: 'add_numbers', sourceOutput: 'sum_B', targetJobId: 'multiply_numbers', targetInput: 'multiplier' }
                ],
                outputBindings: {
                    product: 'final_product'
                }
            }
        }
    ]
}; */
export const numericalWorkflow_3 = {
    id: 'numerical_workflow_3',
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
};
