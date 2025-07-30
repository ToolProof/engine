import { GraphStateAnnotationRoot, GraphState } from '../types/typesLG';
/* import { NodeDown } from '../nodes/nodeDown';
import { NodeLow } from '../nodes/nodeLow';
import { NodeUp } from '../nodes/nodeUp'; */
import { NodeHigh } from '../nodes/nodeHigh';
import { StateGraph, START, END } from '@langchain/langgraph';

// ATTENTION_RONAK: Currently, edgeRouting is not fully implemented. It can only handle purely sequential workflows and workflows with 'less_than' conditioned while loops.
const edgeRouting = (state: GraphState) => {

    // ATTENTION_RONAK: This is just a temporary hack to check that the docking score is actually written to GraphState.
    // Uncomment when running the adapterAutodockWorkflow_1 workflow.
    /* if (state.workflowSpec.counter === 1) {
        const score = state.workflowSpec.resourceMaps[0].ligand_docking.metadata.score as number;
        console.log('docking_score:', JSON.stringify(score, null, 2));
    } */

    if (state.workflowSpec.counter >= state.workflowSpec.workflow.steps.length) {
        return END;
    }

    const workflowStep = state.workflowSpec.workflow.steps[state.workflowSpec.counter];

    const whileLoopCondition = workflowStep.whileLoopCondition;
    if (!whileLoopCondition) {
        return 'nodeHigh'; // If no while loop condition is specified, we assume the step should be executed
    }

    const resource = whileLoopCondition.resource;
    const variable = whileLoopCondition.variable;
    if (state.workflowSpec.resourceMaps[0][resource]) {
        const value = state.workflowSpec.resourceMaps[0][resource].metadata![variable] as number; // ATTENTION: temporary hack

        if (whileLoopCondition.op === 'less_than' && value < whileLoopCondition.value) {
            return 'nodeHigh';
        } else {
            return END;
        }
    } else {
        return 'nodeHigh'; // If resource is not defined, we assume we're at the start of a new loop
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



