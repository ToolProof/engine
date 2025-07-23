import { runRemoteGraph as runWorkflowRunner } from './testClients/clientWorkflowRunner.js';

if (process.env.NODE_ENV === 'workflowRunner') {
    runWorkflowRunner();
}