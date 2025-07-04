import { NodeBase, GraphState } from '../types.js';
import { RunnableConfig } from '@langchain/core/runnables';
interface TSpec {
    inputs: {
        key: string;
        intraMorphisms: {
            fetch: (url: string) => Promise<string>;
            transform: (content: string) => any | Promise<any>;
        };
    }[];
}
export declare class NodeMutus extends NodeBase<TSpec> {
    spec: TSpec;
    constructor(spec: TSpec);
    invoke(state: GraphState, options?: Partial<RunnableConfig<Record<string, any>>>): Promise<Partial<GraphState>>;
}
export {};
