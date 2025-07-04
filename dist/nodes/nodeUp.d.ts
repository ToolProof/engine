import { NodeBase, GraphState } from '../types.js';
import { RunnableConfig } from '@langchain/core/runnables';
interface TSpec {
    units: {
        key: string;
        path: string;
    }[];
}
export declare class NodeUp extends NodeBase<TSpec> {
    spec: TSpec;
    constructor(spec: TSpec);
    invoke(state: GraphState, options?: Partial<RunnableConfig<Record<string, any>>>): Promise<Partial<GraphState>>;
}
export {};
