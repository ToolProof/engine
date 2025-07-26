import { Annotation, MessagesAnnotation } from '@langchain/langgraph';
import { Runnable } from '@langchain/core/runnables';

export type InputMap = {
    [key: string]: string;
}

export interface ConceptBase {
    id: string;
}

export interface Concept extends ConceptBase {
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

export interface ResourceRole extends Concept { }

export interface ResourceSpec {
    type: ResourceType;
    role: ResourceRole;
}

export interface Job extends Concept {
    url: string;
    syntacticSpec: {
        inputs: ResourceSpec[];
        outputs: ResourceSpec[];
    }
}

export interface DataExchange {
    sourceJobId: string;
    sourceOutput: string; // Validator ensures that this output exists in sourceJob's outputs
    targetJobId: string;
    targetInput: string; // Validator ensures that this input exists in the targetJob's inputs
}

export interface WorkflowStep extends ConceptBase {
    jobId: string; // The job that this step executes
    dataExchanges: DataExchange[]; // Validator ensures that the job gets the correct inputs from the links leading to it
    resultBindings: {
        [outputRole: string]: string;
    };
}

export type Condition =
    | { op: 'equals'; left: string; right: any }
    | { op: 'not_equals'; left: string; right: any }
    | { op: 'greater_than'; left: string; right: number }
    | { op: 'less_than'; left: string; right: number }
    | { op: 'and'; conditions: Condition[] }
    | { op: 'or'; conditions: Condition[] }
    | { op: 'not'; condition: Condition }
    | { op: 'always' }; // Always true — fallback/default branch

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
    inputMaps: T[]; // All items must be the same type T
}

export const GraphStateAnnotationRoot = Annotation.Root({
    ...MessagesAnnotation.spec,
    dryModeManager: Annotation<{
        dryRunMode: boolean;
        delay: number;
        drySocketMode: boolean;
    }>(
        {
            reducer: (prev, next) => next,
            default: () => ({
                dryRunMode: false,
                delay: 0,
                drySocketMode: false,
            }),
        }
    ),
    workflowSpec: Annotation<WorkflowSpec>(),
});

export type GraphState = typeof GraphStateAnnotationRoot.State;

export abstract class NodeBase extends Runnable {

    lc_namespace = []; // ATTENTION: Assigning an empty array for now to honor the contract with the Runnable class, which implements RunnableInterface.

}