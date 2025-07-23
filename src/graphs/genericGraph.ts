import { GraphStateAnnotationRoot, GraphState } from '../types';
import { NodeDown } from '../nodes/nodeDown';
import { NodeLow } from '../nodes/nodeLow';
import { NodeUp } from '../nodes/nodeUp';
import { NodeHigh } from '../nodes/nodeHigh';
import { StateGraph, START, END } from '@langchain/langgraph';

var counter = 0;


const edgeRouting = (state: GraphState) => {
    // 0 -> NodeHigh
    console.log('state.counter :', counter);
    console.log('state.workflow :', state.workflow);
    console.log('state.workflow.nodes[state.counter] :', state.workflow.nodes[counter]);
    if(!state.workflow.nodes[counter]) {
        counter = 0;
        return END;
    }
    // switch (state.workflow.nodes[state.counter].langgraphNodeToUse) {
    //     case 'NodeDown':
    //         return 'nodeDown';
    //     case 'NodeUp':
    //         return 'nodeUp';
    //     case 'NodeHigh':
    //         return 'nodeHigh';
    //     case 'NodeLow':
    //         return 'nodeLow';
    // }
    counter += 1;
    console.log('state.counter :', counter);
    return 'nodeHigh';
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



