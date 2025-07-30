export interface Metadata {
    [key: string]: number | string | boolean;
}
export interface MetadataSpec {
    [key: string]: string;
}
export interface ResourceMap {
    [key: string]: {
        path: string;
        metadata?: Metadata;
    };
}
export interface Identifiable {
    id: string;
}
export interface Concept extends Identifiable {
    name: string;
    semanticSpec: {
        description: string;
        embedding: number[];
    };
}
export interface ResourceType extends Concept {
    syntacticSpec: {
        format: string;
        schema: object | null;
    };
}
export interface ResourceRole extends Concept {
}
export interface ResourceSpec {
    type: ResourceType;
    role: ResourceRole;
}
export interface Job extends Concept {
    url: string;
    syntacticSpec: {
        inputs: ResourceSpec[];
        outputs: (ResourceSpec & {
            metadataSpec?: MetadataSpec;
        })[];
    };
}
export interface ResourceBindings {
    [role: string]: string;
}
export type Condition = {
    op: 'equals';
    resource: string;
    variable: string;
    value: any;
} | {
    op: 'not_equals';
    resource: string;
    variable: string;
    value: any;
} | {
    op: 'greater_than';
    resource: string;
    variable: string;
    value: number;
} | {
    op: 'less_than';
    resource: string;
    variable: string;
    value: number;
} | {
    op: 'and';
    conditions: Condition[];
} | {
    op: 'or';
    conditions: Condition[];
} | {
    op: 'not';
    condition: Condition;
} | {
    op: 'always';
};
export interface WorkflowStep extends Identifiable {
    jobId: string;
    inputBindings: ResourceBindings;
    outputBindings: ResourceBindings;
    branchingCondition?: Condition;
    whileLoopCondition?: Condition;
    forLoopIterations?: number;
}
export interface Workflow extends Identifiable {
    steps: WorkflowStep[];
}
export interface WorkflowSpec<T extends ResourceMap = ResourceMap> {
    workflow: Workflow;
    resourceMaps: T[];
    counter: number;
}
