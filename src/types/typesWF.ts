// This file contains TypeScript types and interfaces for defining workflows, jobs, and resources in a system.


export interface ExtractedData {
    [key: string]: number | string | boolean;
}

export interface ExtractedDataSpec {
    [key: string]: 'number' | 'string' | 'boolean';
}

export interface Identifiable {
    id: string;
}

export interface Concept<T extends string> extends Identifiable {
    name: T;
    description: string; // ATTENTION: SemanticString?
}

export type ResourceMap<V extends string> = {
    [K in V]?: { path: string, extractedData?: ExtractedData };
}

export type ResourceFormat = 'json' | 'txt' | 'pdb' | 'pdbqt' | 'sdf';

export type ResourceTypeName = 'number' | 'pdb' | 'pdbqt_autodock' | 'sdf' | 'smiles';

export type ResourceRoleName = 'addend_1' | 'addend_2' | 'sum' | 'minuend' | 'subtrahend' | 'difference' | 'multiplicand' | 'multiplier' | 'product' | 'divisor' | 'dividend' | 'quotient' |
    'ligand' | 'receptor' | 'box' | 'ligand_docking' | 'ligand_pose' | 'receptor_pose';

export interface ResourceType extends Concept<ResourceTypeName> {
    format: ResourceFormat;
    schema?: string; // URL to schema definition
    validator?: string; // URL to validator job
    extractor?: string; // URL to extractor job
}

export interface ResourceRole extends Concept<ResourceRoleName> {
    type: ResourceType;
}

export interface Job extends Concept<string> {
    url: string;
    resources: {
        inputs: ResourceRole[];
        outputs: ResourceRole[];
    }
}

export interface ResourceBindings {
    [role: string]: string;
};

export type Condition =
    // Comparison operators
    | {
        op: 'equals';
        resource: string;
        variable: string;
        value: any
    }
    | {
        op: 'not_equals';
        resource: string;
        variable: string;
        value: any
    }
    | {
        op: 'greater_than';
        resource: string;
        variable: string;
        value: number
    }
    | {
        op: 'less_than';
        resource: string;
        variable: string;
        value: number
    }
    // Logical operators
    | {
        op: 'and';
        conditions: Condition[]
    }
    | {
        op: 'or';
        conditions: Condition[]
    }
    | {
        op: 'not';
        condition: Condition
    }
    // Default/fallback
    | {
        op: 'always'
    }; // Always true — fallback/default branch

export interface WorkflowStep extends Identifiable {
    jobId: string; // The job that this step executes
    inputBindings: ResourceBindings; // Maps outputs from previous jobs to this job's inputs
    outputBindings: ResourceBindings; // Maps this job's outputs to the workflow's resource map

    // Optional control flow:
    branchingCondition?: Condition;
    whileLoopCondition?: Condition;
    forLoopIterations?: number;
}

export interface Workflow extends Identifiable {
    steps: WorkflowStep[];
}

export interface WorkflowSpec {
    workflow: Workflow;
    // ATTENTION_RONAK: This is an array to allow for parallel workflow executions in the future. This way, one can specify several sets of inputs, and resourceMaps.length encodes the number of parallel executions. For now, we'll only use resourceMaps[0].
    resourceMaps: ResourceMap<string>[]; // ATTENTION: For the same Workflow, all items must be the same type
    counter: number; // ATTENTION: hack for simplified, sequential workflows
}
