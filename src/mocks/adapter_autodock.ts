import { RT, RR } from './registries.js';
import { Job, Workflow, WorkflowSpec } from '../types/typesWF.js';
import { v4 as uuidv4 } from 'uuid';


// ATTENTION_RONAK: In this module, jobs and workflows for adapter_autodock are hardcoded for demonstration purposes. Later, UI/AI-agent + validator will take care of this. You don't need to do anything here. I'm guiding you here just for your understanding.

// Choose where to run the jobs
const prefixCloudRun = 'https://adapter-autodock-384484325421.europe-west2.run.app/';
const prefixKubernetes = 'http://34.88.46.28/';
const prefix = prefixCloudRun;

// ATTENTION_RONAK: I've only defined the basic_docking job here. I'll add reactive_docking later.
export const adapterAutodockJobs: Map<string, Job> = new Map([
    ['basic_docking', {
        id: 'basic_docking',
        name: 'basic_docking',
        url: `${prefix}/basic_docking`,
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
                    role: RR('ligand_docking'),
                    metadataSpec: {
                        score: 'number', // ATTENTION_RONAK: The job hereby specifies that its metadata object will contain the docking score represented as a number. NodeHigh will write this to GraphState so that it can be used in conditions in subsequent steps of the workflow.
                    }
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
        }
    }],
])

// ATTENTION_RONAK: The adapterAutodockWorkflow_1 is a workflow that uses the adapterAutodockJobs defined above (currently only basic_docking). It invokes the basic_docking job and checks the docking score to decide whether to proceed with docking or not.
const adapterAutodockWorkflow_1: Workflow = {
    id: 'adapter_autodock_workflow_1',
    steps: [
        {
            id: uuidv4(),
            jobId: 'basic_docking',
            inputBindings: {
                ligand: 'ligand',
                receptor: 'receptor',
                box: 'box'
            },
            outputBindings: {
                // Here, we bind the ligand_docking output to the name 'ligand', so that it can be used as input in the next iteration.
                'ligand_docking': 'ligand',
            },
            whileLoopCondition: {
                op: 'less_than',
                left: 'score',
                right: 15
            }
        },
    ]
};


// ATTENTION_RONAK: This workflow can't be run yet, as edgeRouting and NodeHigh are not yet implemented for workflows with conditional steps.
export const adapterAutodockWorkflowSpec: WorkflowSpec = {
    workflow: adapterAutodockWorkflow_1,
    // Initial inputs for the workflow
    resourceMaps: [
        {
            'ligand': { path: 'adapter_autodock/_inputs/ligand.smi', metadata: {} },
            'receptor': { path: 'adapter_autodock/_inputs/receptor.pdb', metadata: {} },
            'box': { path: 'adapter_autodock/_inputs/box.pdb', metadata: {} }
        },
    ],
    counter: 0
};