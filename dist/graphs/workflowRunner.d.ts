export declare const graph: import("@langchain/langgraph").CompiledStateGraph<import("@langchain/langgraph").StateType<{
    dryModeManager: import("@langchain/langgraph").BinaryOperatorAggregate<{
        dryRunMode: boolean;
        delay: number;
        drySocketMode: boolean;
    }, {
        dryRunMode: boolean;
        delay: number;
        drySocketMode: boolean;
    }>;
    workflowSpec: import("@langchain/langgraph").LastValue<import("../types/typesWF").WorkflowSpec<import("../types/typesWF").InputMap>>;
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages").BaseMessage[], import("@langchain/langgraph").Messages>;
}>, import("@langchain/langgraph").UpdateType<{
    dryModeManager: import("@langchain/langgraph").BinaryOperatorAggregate<{
        dryRunMode: boolean;
        delay: number;
        drySocketMode: boolean;
    }, {
        dryRunMode: boolean;
        delay: number;
        drySocketMode: boolean;
    }>;
    workflowSpec: import("@langchain/langgraph").LastValue<import("../types/typesWF").WorkflowSpec<import("../types/typesWF").InputMap>>;
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages").BaseMessage[], import("@langchain/langgraph").Messages>;
}>, "__start__" | "nodeDown" | "nodeUp" | "nodeHigh" | "nodeLow", {
    dryModeManager: import("@langchain/langgraph").BinaryOperatorAggregate<{
        dryRunMode: boolean;
        delay: number;
        drySocketMode: boolean;
    }, {
        dryRunMode: boolean;
        delay: number;
        drySocketMode: boolean;
    }>;
    workflowSpec: import("@langchain/langgraph").LastValue<import("../types/typesWF").WorkflowSpec<import("../types/typesWF").InputMap>>;
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages").BaseMessage[], import("@langchain/langgraph").Messages>;
}, {
    dryModeManager: import("@langchain/langgraph").BinaryOperatorAggregate<{
        dryRunMode: boolean;
        delay: number;
        drySocketMode: boolean;
    }, {
        dryRunMode: boolean;
        delay: number;
        drySocketMode: boolean;
    }>;
    workflowSpec: import("@langchain/langgraph").LastValue<import("../types/typesWF").WorkflowSpec<import("../types/typesWF").InputMap>>;
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages").BaseMessage[], import("@langchain/langgraph").Messages>;
}, import("@langchain/langgraph").StateDefinition>;
