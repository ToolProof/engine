import { NodeBase, GraphState } from '../types.js';
import { RunnableConfig } from '@langchain/core/runnables';
interface TSpec<Outputs extends readonly string[] = string[]> {
    inputs: string[];
    outputs: Outputs;
    interMorphism: (...args: any[]) => {
        [K in Outputs[number]]: any;
    };
}
export declare class NodeNomen<Outputs extends readonly string[]> extends NodeBase<TSpec<Outputs>> {
    spec: TSpec<Outputs>;
    constructor(spec: TSpec<Outputs>);
    invoke(state: GraphState, options?: Partial<RunnableConfig<Record<string, any>>>): Promise<Partial<GraphState>>;
}
export {};
