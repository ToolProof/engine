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
    resourceMap: import("@langchain/langgraph").LastValue<import("../types.js").ResourceMap>;
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages.js").BaseMessage[], import("@langchain/langgraph").Messages>;
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
    resourceMap: import("@langchain/langgraph").LastValue<import("../types.js").ResourceMap>;
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages.js").BaseMessage[], import("@langchain/langgraph").Messages>;
}>, "__start__" | "nodeDown", {
    dryModeManager: import("@langchain/langgraph").BinaryOperatorAggregate<{
        dryRunMode: boolean;
        delay: number;
        drySocketMode: boolean;
    }, {
        dryRunMode: boolean;
        delay: number;
        drySocketMode: boolean;
    }>;
    resourceMap: import("@langchain/langgraph").LastValue<import("../types.js").ResourceMap>;
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages.js").BaseMessage[], import("@langchain/langgraph").Messages>;
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
    resourceMap: import("@langchain/langgraph").LastValue<import("../types.js").ResourceMap>;
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages.js").BaseMessage[], import("@langchain/langgraph").Messages>;
}, import("@langchain/langgraph").StateDefinition>;
