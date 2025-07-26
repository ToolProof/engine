import { NodeBase, GraphState } from '../types/typesLG.js';
import { RunnableConfig } from '@langchain/core/runnables';
export declare class NodeLow extends NodeBase {
    constructor();
    invoke(state: GraphState, options?: Partial<RunnableConfig<Record<string, any>>>): Promise<Partial<GraphState>>;
}
