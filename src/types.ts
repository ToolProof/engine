import { Annotation, MessagesAnnotation } from '@langchain/langgraph';
import { Runnable } from '@langchain/core/runnables';

export type InputMap = {
    [key: string]: string;
}

export interface Tool {
    id: string;
    displayName: string;
}

export interface Concept extends Tool {
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

export interface Job extends Concept {
    url: string;
    syntacticSpec: {
        inputs: ResourceType[];
        outputs: ResourceType[];
    }
}

export interface WorkflowNode {
    job: Job;
    isFakeStep: boolean;
}

export interface WorkflowEdge {
    from: string; // WorkflowNode id
    to: string;   // WorkflowNode id
    dataFlow: string[]; // The specific outputs from 'from' that become inputs to 'to'
}

export interface Workflow {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
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