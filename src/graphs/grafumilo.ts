import { GraphStateAnnotationRoot } from '../types.js';
import { NodeDown } from '../nodes/nodeDown.js';
import { transportRegistry } from '../registries/registries.js';
import { StateGraph, START, END } from '@langchain/langgraph';


const stateGraph = new StateGraph(GraphStateAnnotationRoot)
    .addNode('nodeDown', new NodeDown({
        units: [
            {
                key: 'candidate',
                intraMorphisms: {
                    transport: transportRegistry.fetchContentFromUrl2,
                    transform: () => { } //intraMorphismRegistry.getCandidates,
                }
            },
        ]
        /* inputs: [
            {
                key: 'container',
                intraMorphisms: {
                    fetch: fetchRegistry.fetchContentFromUrl2,
                    transform: intraMorphismRegistry.getNodeInvocationsFromSourceCode,
                }
            },
        ] */
    }))
    .addEdge(START, 'nodeDown')
    .addEdge('nodeDown', END);

export const graph = stateGraph.compile();
