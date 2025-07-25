import { RT } from './resourceTypeRegistry';
import { v4 as uuidv4 } from 'uuid';
export const mockJobs_1 = [
    {
        id: uuidv4(),
        displayName: 'add_numbers',
        url: 'https://dummy-url.com/add_numbers',
        semanticSpec: {
            description: 'Add two numbers together.',
            embedding: []
        },
        syntacticSpec: {
            inputs: [RT('number'), RT('number')],
            outputs: [RT('number')]
        }
    },
    {
        id: uuidv4(),
        displayName: 'subtract_numbers',
        url: 'https://dummy-url.com/subtract_numbers',
        semanticSpec: {
            description: 'Subtract one number from another.',
            embedding: []
        },
        syntacticSpec: {
            inputs: [RT('number'), RT('number')],
            outputs: [RT('number')]
        }
    },
    {
        id: uuidv4(),
        displayName: 'multiply_numbers',
        url: 'https://dummy-url.com/multiply_numbers',
        semanticSpec: {
            description: 'Multiply two numbers together.',
            embedding: []
        },
        syntacticSpec: {
            inputs: [RT('number'), RT('number')],
            outputs: [RT('number')]
        }
    },
    {
        id: uuidv4(),
        displayName: 'divide_numbers',
        url: 'https://dummy-url.com/divide_numbers',
        semanticSpec: {
            description: 'Divide one number by another.',
            embedding: []
        },
        syntacticSpec: {
            inputs: [RT('number'), RT('character')],
            outputs: [RT('number')]
        }
    }
];
