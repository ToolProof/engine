import { NodeBase, GraphState } from '../types.js';
import { RunnableConfig } from '@langchain/core/runnables';
export declare class NodeUp extends NodeBase {
    constructor();
    invoke(state: GraphState, options?: Partial<RunnableConfig<Record<string, any>>>): Promise<Partial<GraphState>>;
}
