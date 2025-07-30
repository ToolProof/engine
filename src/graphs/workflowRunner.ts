import { GraphStateAnnotationRoot, GraphState } from '../types/typesLG';
/* import { NodeDown } from '../nodes/nodeDown';
import { NodeLow } from '../nodes/nodeLow';
import { NodeUp } from '../nodes/nodeUp'; */
import { NodeHigh } from '../nodes/nodeHigh';
import { StateGraph, START, END } from '@langchain/langgraph';

// ATTENTION_RONAK: Currently, edgeRouting is not fully implemented. It can only handle purely sequential workflows and workflows with 'less_than' conditioned while loops.
const edgeRouting = (state: GraphState) => {
    if (state.workflowSpec.counter >= state.workflowSpec.workflow.steps.length) {
        return END;
    }

    const workflowStep = state.workflowSpec.workflow.steps[state.workflowSpec.counter];

    const whileLoopCondition = workflowStep.whileLoopCondition;
    if (!whileLoopCondition) {
        return 'nodeHigh'; // If no while loop condition is specified, we assume the step should be executed
    }

    const leftVariable = whileLoopCondition.left;
    if (state.workflowSpec.resourceMaps[0][leftVariable]) {
        const result = state.workflowSpec.resourceMaps[0][leftVariable].metadata.result;

        if (whileLoopCondition.op === 'less_than' && result < whileLoopCondition.right) {
            return 'nodeHigh';
        } else {
            return END;
        }
    } else {
        return 'nodeHigh'; // If leftVariable is not defined, we assume we're at the start of a new loop
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



