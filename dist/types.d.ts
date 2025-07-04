import { Runnable } from '@langchain/core/runnables';
export type Resource = {
    path: string;
    value: any;
};
export type ResourceMap = {
    [key: string]: Resource;
};
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
    resourceMap: import("@langchain/langgraph").LastValue<ResourceMap>;
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages").BaseMessage[], import("@langchain/langgraph").Messages>;
}>;
export type GraphState = typeof GraphStateAnnotationRoot.State;
export declare abstract class NodeBase<TSpec> extends Runnable {
    abstract spec: TSpec;
    lc_namespace: never[];
}
