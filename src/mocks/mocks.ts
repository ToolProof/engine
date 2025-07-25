import { RT, RR } from './registries';
import { Job, Workflow } from '../types';

export const fakeJobs: Map<string, Job> = new Map([
    ['start_job', {
        id: 'start_job',
        name: 'start_job',
        url: 'https://dummy-url.com/start_job   ',
        semanticSpec: {
            description: 'Starts a workflow.',
            embedding: []
        },
        syntacticSpec: {
            inputs: [
            ],
            outputs: [
            ]
        }
    }],
    ['end_job', {
        id: 'end_job',
        name: 'end_job',
        url: 'https://dummy-url.com/end_job   ',
        semanticSpec: {
            description: 'Ends a workflow.',
            embedding: []
        },
        syntacticSpec: {
            inputs: [
            ],
            outputs: [
            ]
        }
    }],
]);

export const numericalJobs: Map<string, Job> = new Map([
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
])


const numericalWorkflow_1: Workflow = {
    nodes: [
        {
            job: fakeJobs.get('start_job')!,
            isFake: true
        },
        {
            job: numericalJobs.get('add_numbers')!,
            isFake: false
        },
        {
            job: fakeJobs.get('end_job')!,
            isFake: true
        }
    ],
    edges: [
        {
            id: 'edge_1',
            source: 'start_job',
            target: 'add_numbers'
        },
        {
            id: 'edge_2',
            source: 'add_numbers',
            target: 'add_numbers'
        },
        {
            id: 'edge_3',
            source: 'add_numbers',
            target: 'end_job'
        }
    ],
    steps: [
        {
            edgeId: 'edge_1',
            dataExchanges: [
                {
                    edgeId: 'edge_1',
                    sourceOutput: 'addend_1',
                    targetInput: 'addend_1'
                },
                {
                    edgeId: 'edge_1',
                    sourceOutput: 'addend_2',
                    targetInput: 'addend_2'
                }
            ]
        },
        {
            edgeId: 'edge_2',
            dataExchanges: [
                {
                    edgeId: 'edge_2',
                    sourceOutput: 'sum',
                    targetInput: 'addend_1'
                },
                {
                    edgeId: 'edge_1',
                    sourceOutput: 'addend_3',
                    targetInput: 'addend_2'
                }
            ]
        },
        {
            edgeId: 'edge_2',
            dataExchanges: [
                {
                    edgeId: 'edge_2',
                    sourceOutput: 'sum',
                    targetInput: 'addend_1'
                },
                {
                    edgeId: 'edge_1',
                    sourceOutput: 'addend_4',
                    targetInput: 'addend_2'
                }
            ]
        },
        {
            edgeId: 'edge_2',
            dataExchanges: [
                {
                    edgeId: 'edge_2',
                    sourceOutput: 'sum',
                    targetInput: 'addend_1'
                },
                {
                    edgeId: 'edge_1',
                    sourceOutput: 'addend_5',
                    targetInput: 'addend_2'
                }
            ]
        },
        {
            edgeId: 'edge_3',
            dataExchanges: [
                {
                    edgeId: 'edge_3',
                    sourceOutput: 'sum',
                    targetInput: 'sum'
                }
            ]
        }
    ]
}