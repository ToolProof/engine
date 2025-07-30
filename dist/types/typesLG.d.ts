import { WorkflowSpec } from './typesWF';
import { Runnable } from '@langchain/core/runnables';
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
    workflowSpec: import("@langchain/langgraph").LastValue<WorkflowSpec<import("./typesWF").ResourceMap>>;
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages").BaseMessage[], import("@langchain/langgraph").Messages>;
}>;
export type GraphState = typeof GraphStateAnnotationRoot.State;
export declare abstract class NodeBase extends Runnable {
    lc_namespace: never[];
}
