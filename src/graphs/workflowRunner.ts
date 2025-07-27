import { GraphStateAnnotationRoot, GraphState } from '../types/typesLG';
/* import { NodeDown } from '../nodes/nodeDown';
import { NodeLow } from '../nodes/nodeLow';
import { NodeUp } from '../nodes/nodeUp'; */
import { NodeHigh } from '../nodes/nodeHigh';
import { StateGraph, START, END } from '@langchain/langgraph';


const edgeRouting = (state: GraphState) => {
    if (state.workflowSpec.counter < state.workflowSpec.workflow.steps.length) {
        return 'nodeHigh';
    }
    return END;
};


const stateGraph = new StateGraph(GraphStateAnnotationRoot)
    /* .addNode(
        'nodeDown',
        new NodeDown()
    )
    .addNode(
        'nodeUp',
        new NodeUp()
    ) */
    .addNode(
        'nodeHigh',
        new NodeHigh()
    )
    /* .addNode(
        'nodeLow',
        new NodeLow()
    ) */
    .addConditionalEdges(START, edgeRouting)
    // .addConditionalEdges('nodeUp', edgeRouting)
    // .addConditionalEdges('nodeDown', edgeRouting)
    .addConditionalEdges('nodeHigh', edgeRouting)
// .addConditionalEdges('nodeLow', edgeRouting)


export const graph = stateGraph.compile();



