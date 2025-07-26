import { GraphStateAnnotationRoot, GraphState } from '../types/typesLG';
import { NodeDown } from '../nodes/nodeDown';
import { NodeLow } from '../nodes/nodeLow';
import { NodeUp } from '../nodes/nodeUp';
import { NodeHigh } from '../nodes/nodeHigh';
import { StateGraph, START, END } from '@langchain/langgraph';


const edgeRouting = (state: GraphState) => {
    
    // We're only using NodeHigh for now.
    // NodeHigh knows how to invoke a job.
    return 'nodeHigh';
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



