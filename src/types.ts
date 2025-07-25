import { Annotation, MessagesAnnotation } from '@langchain/langgraph';
import { Runnable } from '@langchain/core/runnables';

export type InputMap = {
    [key: string]: string;
}

export interface Concept {
    id: string;
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

export interface WorkflowNode {
    job: Job;
    isFake: boolean;
}

export interface WorkflowEdge {
    id: string; // Unique identifier for the edge
    source: string;
    target: string;
}

export interface DataExchange {
    edgeId: string;
    sourceOutput: string; // Validator ensures that this output exists in the 'source' node's job outputs
    targetInput: string; // Validator ensures that this input exists in the 'target' node's job inputs
}

export interface WorkflowStep {
    edgeId: string; // The edge's target node is run
    dataExchanges: DataExchange[]; // Validator ensures that the edge's target node gets the correct inputs from the source node's outputs
}

export interface Workflow {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[]; // Validator ensures that edges connect nodes with matching inputs and outputs
    steps: WorkflowStep[];
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