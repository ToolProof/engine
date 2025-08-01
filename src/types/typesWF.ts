
// ATTENTION_RONAK: This file contains TypeScript types and interfaces for defining workflows, jobs, and resources in a system. It is used to structure the data and ensure type safety across the application. You don't need to do anything here. I'm guiding you here just for your understanding.

export interface Metadata {
    [key: string]: number | string | boolean;
}

export interface MetadataSpec {
    [key: string]: 'number' | 'string' | 'boolean'; // Defines the expected types of metadata
}

export interface ResourceMap {
    [key: string]: { path: string, metadata?: Metadata };
}

export interface Identifiable {
    id: string;
}

export interface Concept extends Identifiable {
    name: string;
    semanticSpec: {
        description: string;
        embedding: number[];
    }
}

export interface ResourceType extends Concept {
    syntacticSpec: {
        format: string; // ATTENTION: prefer a set of predefined formats
        schema: object | null; // JSON schema for validation
    }
}

export interface ResourceRole extends Concept {
    type: ResourceType;
}

export interface ResourceSpec {
    role: ResourceRole;
}

export interface Job extends Concept {
    url: string;
    syntacticSpec: {
        inputs: ResourceSpec[];
        // ATTENTION_RONAK: Note how a job must specify the metadata it produces per output. This is so that the workflow validator can ensure that conditions that are specified only refer to metadata that is produced by previous jobs. In adapterAutodockWorkflow_1, the validator can check that the 'score' metadata is produced by the 'basic_docking' job before it is used in the conditional step.
        outputs: (ResourceSpec & { metadataSpec?: MetadataSpec })[];
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

export interface WorkflowSpec<T extends ResourceMap = ResourceMap> {
    workflow: Workflow;
    // ATTENTION_RONAK: This is an array to allow for parallel workflow executions in the future. This way, one can specify several sets of inputs, and resourceMaps.length encodes the number of parallel executions. For now, we'll only use resourceMaps[0].
    resourceMaps: T[]; // All items must be the same type T
    counter: number; // ATTENTION: hack for simplified, sequential workflows
}
