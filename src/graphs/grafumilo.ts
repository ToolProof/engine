import { GraphStateAnnotationRoot } from '../types.js';
import { NodeMutus } from '../nodes/nodeMutus.js';
import { transportRegistry } from '../registries/registries.js';
import { StateGraph, START, END } from '@langchain/langgraph';


const stateGraph = new StateGraph(GraphStateAnnotationRoot)
    .addNode('nodeMutus', new NodeMutus({
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
    .addEdge(START, 'nodeMutus')
    .addEdge('nodeMutus', END);

export const graph = stateGraph.compile();
