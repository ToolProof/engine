export type InputMap = {
    [key: string]: string;
};
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
        outputs: ResourceSpec[];
    };
    metadata: {
        output: string;
        metadata: object;
    }[];
}
export interface DataExchange {
    sourceJobId: string;
    sourceOutput: string;
    targetJobId: string;
    targetInput: string;
}
export interface WorkflowStep extends Identifiable {
    jobId: string;
    dataExchanges: DataExchange[];
    outputBindings: {
        [outputRole: string]: string;
    };
}
export type Condition = {
    op: 'equals';
    left: string;
    right: any;
} | {
    op: 'not_equals';
    left: string;
    right: any;
} | {
    op: 'greater_than';
    left: string;
    right: number;
} | {
    op: 'less_than';
    left: string;
    right: number;
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
export interface ActualWorkflowStep {
    type: 'actual';
    step: WorkflowStep;
}
export interface ParallelWorkflowStep {
    type: 'parallel';
    branches: WorkflowStepUnion[][];
}
export interface ConditionalWorkflowStep {
    type: 'conditional';
    branches: {
        condition: Condition;
        steps: WorkflowStepUnion[];
    }[];
}
export interface WhileLoopWorkflowStep {
    type: 'while';
    condition: Condition;
    body: ActualWorkflowStep[];
}
export interface ForLoopWorkflowStep {
    type: 'for';
    iterations: number;
    body: WorkflowStepUnion[];
}
export type WorkflowStepUnion = ActualWorkflowStep | ParallelWorkflowStep | ConditionalWorkflowStep | WhileLoopWorkflowStep | ForLoopWorkflowStep;
export interface Workflow extends Identifiable {
    steps: (ActualWorkflowStep | ConditionalWorkflowStep)[];
}
export interface WorkflowSpec<T extends InputMap = InputMap> {
    workflow: Workflow;
    inputMaps: T[];
    counter: number;
}
