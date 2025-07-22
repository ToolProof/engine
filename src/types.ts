import { Annotation, MessagesAnnotation } from '@langchain/langgraph';
import { Runnable } from '@langchain/core/runnables';

export type Resource = {
    path: string;
    value: any; // ATTENTION
}

export type ResourceMap = {
    [key: string]: Resource;
}


/***
 * ATTENTION_RONAK: I have copied these types from toolproof_core just so that Workflow can be used in the GraphState. However, since there'll now be a generic graph, updohilo does not need to be a library anymore. I will move it to toolproof_core later.
*/
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
    isFakeStep?: boolean;
    langgraphNodeToUse: 'NodeDown' | 'NodeUp' | 'NodeHigh' | 'NodeLow'; // ATTENTION_RONAK: I've added this field just as a mock to show how edgeRouting in genericGraph.ts can be used to route to the correct node.
}

export interface FakeStepInputs {
    [key: string]: string; // Maps input name to selected file name
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
/**
 * END of copied types from toolproof_core
*/


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
    resourceMap: Annotation<ResourceMap>(),
    workflow: Annotation<Workflow>(), // ATTENTION_RONAK: This is the workflow that the graph will execute. It will be set by the remote graph that invokes this generic graph.
    counter: Annotation<number>(), // ATTENTION_RONAK: This is a counter to keep track of the current node in the workflow. It should be incremented by each node after its invoke method is called.
});

export type GraphState = typeof GraphStateAnnotationRoot.State;

export abstract class NodeBase extends Runnable {

    lc_namespace = []; // ATTENTION: Assigning an empty array for now to honor the contract with the Runnable class, which implements RunnableInterface.

}