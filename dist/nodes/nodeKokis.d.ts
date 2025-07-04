import { NodeBase, GraphState } from '../types.js';
import { RunnableConfig } from '@langchain/core/runnables';
interface TSpec {
    inputs: string[];
    outputDir: string;
    interMorphism: () => string;
}
export declare class NodeKokis extends NodeBase<TSpec> {
    spec: TSpec;
    constructor(spec: TSpec);
    invoke(state: GraphState, options?: Partial<RunnableConfig<Record<string, any>>>): Promise<Partial<GraphState>>;
}
export {};
