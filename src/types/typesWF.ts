
// ATTENTION_RONAK: This file contains TypeScript types and interfaces for defining workflows, jobs, and resources in a system. It is used to structure the data and ensure type safety across the application. You don't need to do anything here. I'm guiding you here just for your understanding.

export type InputMap = {
    [key: string]: string;
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
    metadata: {
        output: string;
        metadata: object;
    }[];
}

export interface DataExchange {
    sourceJobId: string;
    sourceOutput: string; // Validator ensures that this output exists in sourceJob's outputs
    targetJobId: string;
    targetInput: string; // Validator ensures that this input exists in the targetJob's inputs
}

export interface WorkflowStep extends Identifiable {
    jobId: string; // The job that this step executes
    dataExchanges: DataExchange[]; // Validator ensures that the job gets the correct inputs from the links leading to it
    outputBindings: {
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
    body: ActualWorkflowStep[]; // WorkflowStepUnion[]; // ATTENTION: simplified for now
}

export interface ForLoopWorkflowStep {
    type: 'for';
    iterations: number;
    body: WorkflowStepUnion[];
}

export type WorkflowStepUnion = ActualWorkflowStep | ParallelWorkflowStep | ConditionalWorkflowStep | WhileLoopWorkflowStep | ForLoopWorkflowStep;

export interface Workflow extends Identifiable {
    steps: (ActualWorkflowStep | ConditionalWorkflowStep)[]; // WorkflowStepUnion[]; // ATTENTION: simplified for now
}

export interface WorkflowSpec<T extends InputMap = InputMap> {
    workflow: Workflow;
    inputMaps: T[]; // All items must be the same type T
    // inputMaps.length encodes the number of parallel executions
    counter: number; // ATTENTION: hack for simplified, sequential workflows
}
