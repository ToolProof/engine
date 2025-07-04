import { GraphStateAnnotationRoot } from '../types.js';
import { NodeMutus } from '../nodes/nodeMutus.js';
import { fetchRegistry } from '../registries/registries.js';
import { StateGraph, START, END } from '@langchain/langgraph';


const stateGraph = new StateGraph(GraphStateAnnotationRoot)
    .addNode('nodeMutus', new NodeMutus({
        inputs: [
            {
                key: 'candidate',
                intraMorphisms: {
                    fetch: fetchRegistry.fetchContentFromUrl2,
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
