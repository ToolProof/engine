import { RT, RR } from './registries.js';
import { Job, Workflow } from '../types/typesWF.js';
import { v4 as uuidv4 } from 'uuid';

export const adapterAutodockJobs: Map<string, Job> = new Map([
    ['basic_docking', {
        id: 'basic_docking',
        name: 'basic_docking',
        url: 'http://34.88.46.28/basic_docking',
        semanticSpec: {
            description: 'Perform basic docking.',
            embedding: []
        },
        syntacticSpec: {
            inputs: [
                {
                    type: RT('smiles'),
                    role: RR('ligand')
                },
                {
                    type: RT('pdb'),
                    role: RR('receptor')
                },
                {
                    type: RT('pdb'),
                    role: RR('box')
                }
            ],
            outputs: [
                {
                    type: RT('pdbqt'),
                    role: RR('ligand_docking')
                },
                {
                    type: RT('sfd'),
                    role: RR('ligand_pose')
                },
                {
                    type: RT('pdb'),
                    role: RR('receptor_pose')
                }
            ]
        },
        metadata: [
            {
                output: 'ligand_docking',
                metadata: {
                    score: 'number',
                }
            }
        ]
    }],
])


export const adapterAutodockWorkflow_1: Workflow = {
    id: 'adapter_autodock_workflow_1',
    steps: [
        {
            type: 'actual',
            step: {
                id: uuidv4(),
                jobId: 'basic_docking',
                dataExchanges: [
                    { sourceJobId: 'start_job', sourceOutput: 'ligand', targetJobId: 'basic_docking', targetInput: 'ligand' },
                    { sourceJobId: 'start_job', sourceOutput: 'receptor', targetJobId: 'basic_docking', targetInput: 'receptor' },
                    { sourceJobId: 'start_job', sourceOutput: 'box', targetJobId: 'basic_docking', targetInput: 'box' }
                ],
                outputBindings: {
                }
            }
        },
        {
            type: 'conditional',
            branches: [
                {
                    condition: { op: 'less_than', left: 'score', right: 15 },
                    steps: [
                        {
                            type: 'actual',
                            step: {
                                id: uuidv4(),
                                jobId: 'basic_docking',
                                dataExchanges: [
                                    { sourceJobId: 'basic_docking', sourceOutput: 'ligand_docking', targetJobId: 'basic_docking', targetInput: 'ligand' },
                                    { sourceJobId: 'start_job', sourceOutput: 'receptor', targetJobId: 'basic_docking', targetInput: 'receptor' },
                                    { sourceJobId: 'start_job', sourceOutput: 'box', targetJobId: 'basic_docking', targetInput: 'box' }
                                ],
                                outputBindings: {
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]
};