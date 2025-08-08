import { GraphStateAnnotationRoot, GraphState } from '../types/typesLG';
import { JobRunner } from '../nodes/jobRunner';
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
        return 'jobRunner'; // If no while loop condition is specified, we assume the step should be executed
    }

    const resource = whileLoopCondition.resource;
    const variable = whileLoopCondition.variable;
    if (state.workflowSpec.resourceMaps[0][resource]) {
        // console.log('resourceMaps[0][resource]:', JSON.stringify(state.workflowSpec.resourceMaps[0][resource], null, 2));
        const value = state.workflowSpec.resourceMaps[0][resource].extractedData![variable] as number; // ATTENTION: temporary hack

        if (whileLoopCondition.op === 'less_than' && value < whileLoopCondition.value) {
            return 'jobRunner';
        } else {
            return END;
        }
    } else {
        return 'jobRunner'; // If resource is not defined, we assume we're at the start of a new loop
    }

};


const stateGraph = new StateGraph(GraphStateAnnotationRoot)
    .addNode(
        'jobRunner',
        new JobRunner()
    )
    .addConditionalEdges(START, edgeRouting)
    .addConditionalEdges('jobRunner', edgeRouting)


export const graph = stateGraph.compile();



