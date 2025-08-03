// ATTENTION_RONAK: This file contains TypeScript types and interfaces for defining workflows, jobs, and resources in a system. It is used to structure the data and ensure type safety across the application. You don't need to do anything here. I'm guiding you here just for your understanding.

export interface Metadata {
    [key: string]: number | string | boolean;
}

export interface MetadataSpec {
    [key: string]: 'number' | 'string' | 'boolean'; // Defines the expected types of metadata
}

export interface Identifiable {
    id: string;
}

export interface Concept<T, V extends Domain> extends Identifiable { // ATTENTION: V constricts domain
    role: T;
    description: string; // ATTENTION: SemanticString?
    domain: V;
}

export interface Domain extends Concept<string, Domain> { }

/* export type ResourceMap<T extends string> = {
    [K in T]?: { path: string, metadata?: Metadata }; // Note the ? after K
} */

export type ResourceMap<T extends string> = Concept<string, Domain> & {
    [K in T]?: { path: string, metadata?: Metadata };
}

export interface ResourceType extends Concept<string, Domain> { }

export interface ResourceRole extends Concept<string, Domain> {
    type: ResourceType;
    validator: string; // ATTENTION: Represents a special type of Job
}

export interface ResourceSpec {
    role: ResourceRole;
}

export interface Job<T> extends Concept<string, Domain> {
    url: string;
    resources: {
        inputs: ResourceSpec[];
        // ATTENTION_RONAK: Note how a job must specify the metadata it produces per output. This is so that the workflow validator can ensure that conditions that are specified only refer to metadata that is produced by previous jobs. In adapterAutodockWorkflow_1, the validator can check that the 'score' metadata is produced by the 'basic_docking' job before it is used in the conditional step.
        outputs: (ResourceSpec & { metadataSpec?: MetadataSpec })[];
    }
}

export interface ResourceBindings<T> {
    [role: T]: string;
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

export interface WorkflowStep<T> extends Identifiable {
    jobId: Job<T>; // The job that this step executes
    inputBindings: ResourceBindings<T>; // Maps outputs from previous jobs to this job's inputs
    outputBindings: ResourceBindings<T>; // Maps this job's outputs to the workflow's resource map

    // Optional control flow:
    branchingCondition?: Condition;
    whileLoopCondition?: Condition;
    forLoopIterations?: number;
}

export interface Workflow<T> extends Identifiable {
    steps: WorkflowStep<T>[];
}

export interface WorkflowSpec<T extends string> {
    workflow: Workflow<T>;
    // ATTENTION_RONAK: This is an array to allow for parallel workflow executions in the future. This way, one can specify several sets of inputs, and resourceMaps.length encodes the number of parallel executions. For now, we'll only use resourceMaps[0].
    resourceMaps: ResourceMap<T>[]; // For the same Workflow, all items must be the same type T
    counter: number; // ATTENTION: hack for simplified, sequential workflows
}
