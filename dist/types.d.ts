import { Runnable } from '@langchain/core/runnables';
export type InputMap = {
    [key: string]: string;
};
export interface Tool {
    id: string;
    displayName: string;
}
export interface Concept extends Tool {
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
export interface Job extends Concept {
    url: string;
    syntacticSpec: {
        inputs: ResourceType[];
        outputs: ResourceType[];
    };
}
export interface WorkflowNode {
    job: Job;
    isFakeStep: boolean;
}
export interface WorkflowEdge {
    from: string;
    to: string;
    dataFlow: string[];
}
export interface Workflow {
    workflowNodes: WorkflowNode[];
    workflowEdges: WorkflowEdge[];
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
