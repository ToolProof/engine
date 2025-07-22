import { GraphStateAnnotationRoot, GraphState } from '../types';
import { NodeDown } from '../nodes/nodeDown';
import { NodeLow } from '../nodes/nodeLow';
import { NodeUp } from '../nodes/nodeUp';
import { NodeHigh } from '../nodes/nodeHigh';
import { StateGraph, START } from '@langchain/langgraph';


const edgeRouting = (state: GraphState) => {
    switch (state.workflow.nodes[state.counter].langgraphNodeToUse) {
        case 'NodeDown':
            return 'nodeDown';
        case 'NodeUp':
            return 'nodeUp';
        case 'NodeHigh':
            return 'nodeHigh';
        case 'NodeLow':
            return 'nodeLow';
    }
    // ATTENTION_RONAK: the counter must be incremented somewhere. I'm not sure if GraphState can be mutated by an edge, but each node could do it when returning from its invoke method.
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



