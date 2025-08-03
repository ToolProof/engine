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
        description: 'Perform basic docking.',
        url: `${prefix}basic_docking`,
        resources: {
            inputs: [
                RR('ligand', RT('smiles')),
                RR('receptor', RT('pdb')),
                RR('box', RT('pdb'))
            ],
            outputs: [
                RR('ligand_docking', RT('pdbqt_autodock')),
                RR('ligand_pose', RT('sdf')),
                RR('receptor_pose', RT('pdb'))
            ]
        },
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
                ligand_docking: 'ligand_docking',
                ligand_pose: 'ligand_pose',
                receptor_pose: 'receptor_pose',
                // ATTENTION: If they were of the same ResourceType, we could bind the ligand_docking output to the name 'ligand', so that it could be used as input in the next iteration.
                // 'ligand_docking': 'ligand',
            },
            /* whileLoopCondition: {
                op: 'less_than',
                resource: 'ligand_docking',
                variable: 'score',
                value: 15
            } */
        },
    ]
};


export const adapterAutodockWorkflowSpec_1: WorkflowSpec = {
    workflow: adapterAutodockWorkflow_1,
    // Initial inputs for the workflow
    resourceMaps: [
        {
            'ligand': { path: 'adapter_autodock/_inputs/ligand.smi', extractedData: {} },
            'receptor': { path: 'adapter_autodock/_inputs/receptor.pdb', extractedData: {} },
            'box': { path: 'adapter_autodock/_inputs/box.pdb', extractedData: {} }
        },
    ],
    counter: 0
};