import { Runnable } from '@langchain/core/runnables';
export type InputMap = {
    [key: string]: string;
};
export interface ConceptBase {
    id: string;
}
export interface Concept extends ConceptBase {
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
}
export interface DataExchange {
    sourceJobId: string;
    sourceOutput: string;
    targetJobId: string;
    targetInput: string;
}
export interface WorkflowStep extends ConceptBase {
    jobId: string;
    dataExchanges: DataExchange[];
    resultBindings: {
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
export interface SimpleWorkflowStep {
    type: 'simple';
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
    condition: string;
    body: WorkflowStepUnion[];
}
export interface ForLoopWorkflowStep {
    type: 'for';
    iterations: number;
    body: WorkflowStepUnion[];
}
export type WorkflowStepUnion = SimpleWorkflowStep | ParallelWorkflowStep | ConditionalWorkflowStep | WhileLoopWorkflowStep | ForLoopWorkflowStep;
export interface Workflow extends ConceptBase {
    steps: WorkflowStepUnion[];
}
export interface WorkflowSpec<T extends InputMap = InputMap> {
    workflow: Workflow;
    inputMaps: T[];
}
export declare const GraphStateAnnotationRoot: import("@langchain/langgraph").AnnotationRoot<{
    dryModeManager: import("@langchain/langgraph").BinaryOperatorAggregate<{
        dryRunMode: boolean;
        delay: number;
        drySocketMode: boolean;
    }, {
        dryRunMode: boolean;
        delay: number;
        drySocketMode: boolean;
    }>;
    workflowSpec: import("@langchain/langgraph").LastValue<WorkflowSpec<InputMap>>;
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages").BaseMessage[], import("@langchain/langgraph").Messages>;
}>;
export type GraphState = typeof GraphStateAnnotationRoot.State;
export declare abstract class NodeBase extends Runnable {
    lc_namespace: never[];
}
