import { GraphStateAnnotationRoot, GraphState } from '../types/typesLG';
/* import { NodeDown } from '../nodes/nodeDown';
import { NodeLow } from '../nodes/nodeLow';
import { NodeUp } from '../nodes/nodeUp'; */
import { NodeHigh } from '../nodes/nodeHigh';
import { StateGraph, START, END } from '@langchain/langgraph';

// ATTENTION_RONAK: Currently, edgeRouting is only capable of handling sequential steps in a workflow based on a counter. Later, it will be implemented to handle conditional steps based on metadata written by NodeHigh in GraphState. For now, it simply routes to NodeHigh for the next step if there are more steps in the workflow.
const edgeRouting = (state: GraphState) => {
    /* if (state.workflowSpec.counter < state.workflowSpec.workflow.steps.length) {
        return 'nodeHigh';
    }
    return END; */

    const workflowStep = state.workflowSpec.workflow.steps[state.workflowSpec.counter];

    const whileLoopCondition = workflowStep.whileLoopCondition;
    if (!whileLoopCondition) {
        return END;
    }

    /* 
    whileLoopCondition looks like this: 
        {
            op: 'less_than',
            left: 'sum',
            right: 30
        }
    */

    if (state.workflowSpec.resourceMaps[0].sum) {
        const sum = state.workflowSpec.resourceMaps[0].sum.metadata.result;

        if (whileLoopCondition.op === 'less_than' && sum < whileLoopCondition.right) {
            return 'nodeHigh';
        } else {
            return END;
        }
    } else {
        return 'nodeHigh'; // If sum is not defined, we assume the condition is true and continue the loop
    }

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



