import { runRemoteGraph as runGrafumilo } from './testClients/clientGrafumilo.js';

if (process.env.NODE_ENV === 'grafumilo') {
    runGrafumilo();
}