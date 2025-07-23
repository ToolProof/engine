import { runRemoteGraph as runGrafumilo } from './testClients/clientGrafumilo.js';
import { runRemoteGraph as runGenericGraph } from './testClients/clientGenericGraph.js';

if (process.env.NODE_ENV === 'grafumilo') {
    runGrafumilo();
}

if (process.env.NODE_ENV === 'genericGraph') {
    runGenericGraph();
}