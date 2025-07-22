import { GraphStateAnnotationRoot, GraphState } from '../types';
import { NodeDown } from '../nodes/nodeDown';
import { NodeLow } from '../nodes/nodeLow';
import { NodeUp } from '../nodes/nodeUp';
import { NodeHigh } from '../nodes/nodeHigh';
import { transportRegistry } from '../registries/registries';
import { StateGraph, START } from '@langchain/langgraph';


const edgeRouting = (state: GraphState) => {
    const x = Math.random();
    if (x < 0.25) {
        return 'nodeDown';
    } else if (x < 0.5) {
        return 'nodeUp';
    } else if (x < 0.75) {
        return 'nodeHigh';
    } else {
        return 'nodeLow';
    }
};


const stateGraph = new StateGraph(GraphStateAnnotationRoot)
    .addNode(
        'nodeDown',
        new NodeDown()
    )
    .addNode(
        'nodeUp',
        new NodeUp()
    )
    .addNode(
        'nodeHigh',
        new NodeHigh()
    )
    .addNode(
        'nodeLow',
        new NodeLow()
    )
    .addConditionalEdges(START, edgeRouting)
    .addConditionalEdges('nodeDown', edgeRouting)
    .addConditionalEdges('nodeUp', edgeRouting)
    .addConditionalEdges('nodeHigh', edgeRouting)
    .addConditionalEdges('nodeLow', edgeRouting)


export const graph = stateGraph.compile();



