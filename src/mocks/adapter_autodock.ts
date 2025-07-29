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
            // ATTENTION_RONAK: The job hereby specifies that the output 'ligand_docking' will contain the docking score. This is what you need to extract from the /tmp file and return as metadata in the json response in basic_docking.py in the adapter_autodock repo. NodeHigh will write the score to GraphState so that it can be used in the conditional step of the workflow below. You can look at how the calculator jobs do this in index.ts in the calculator repo. The difference is that here, the output is a file, so you need to read the file and extract the score from it.
            {
                output: 'ligand_docking',
                metadata: {
                    score: 'number',
                }
            }
        ]
    }],
])

// ATTENTION_RONAK: The adapterAutodockWorkflow_1 is a workflow that uses the adapterAutodockJobs defined above (currently only basic_docking). It invokes the basic_docking job and checks the docking score to decide whether to proceed with docking or not.
const adapterAutodockWorkflow_1: Workflow = {
    id: 'adapter_autodock_workflow_1',
    steps: [
        {
            id: uuidv4(),
            jobId: 'basic_docking',
            dataExchanges: [
                { sourceJobId: 'start_job', sourceOutput: 'ligand', targetJobId: 'basic_docking', targetInput: 'ligand' },
                { sourceJobId: 'start_job', sourceOutput: 'receptor', targetJobId: 'basic_docking', targetInput: 'receptor' },
                { sourceJobId: 'start_job', sourceOutput: 'box', targetJobId: 'basic_docking', targetInput: 'box' }
            ],
            outputBindings: {
            }
        },
    ]
};

// ATTENTION_RONAK: this is a conditional step that checks the docking score and decides whether to proceed with the docking or not. The score is written to GraphState by NodeHigh in the previous step.


// ATTENTION_RONAK: This workflow can't be run yet, as edgeRouting and NodeHigh are not yet implemented for workflows with conditional steps.
export const adapterAutodockWorkflowSpec: WorkflowSpec = {
    workflow: adapterAutodockWorkflow_1,
    // start_job
    resourceMaps: [
        {
            'ligand': 'adapter_autodock/_inputs/ligand.smi',
            'receptor': 'adapter_autodock/_inputs/receptor.pdb',
            'box': 'adapter_autodock/_inputs/box.pdb'
        },
    ],
    counter: 0
};