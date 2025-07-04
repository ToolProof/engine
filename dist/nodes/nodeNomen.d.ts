import { NodeBase, GraphState } from '../types.js';
import { RunnableConfig } from '@langchain/core/runnables';
type OutputSpec = {
    key: string;
    intraMorphisms: string[];
};
interface TSpec<Outputs extends readonly OutputSpec[] = OutputSpec[]> {
    inputs: string[];
    outputs: Outputs;
    interMorphism: (...args: any[]) => {
        [K in Outputs[number] as K['key']]: any;
    };
}
export declare class NodeNomen<Outputs extends readonly OutputSpec[]> extends NodeBase<TSpec<Outputs>> {
    spec: TSpec<Outputs>;
    constructor(spec: TSpec<Outputs>);
    invoke(state: GraphState, options?: Partial<RunnableConfig<Record<string, any>>>): Promise<Partial<GraphState>>;
}
export {};
