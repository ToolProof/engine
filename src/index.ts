// import { runRemoteGraph as runWorkflowRunner } from './testClients/clientWorkflowRunner.js';
import { validateWorkflow } from './utils.js';
import { numericalJobs, numericalWorkflow_1, numericalWorkflow_2 } from './mocks/mocks.js';

/* if (process.env.NODE_ENV === 'workflowRunner') {
    runWorkflowRunner();
} */

if (true || process.env.NODE_ENV === 'workflowValidator') { // ATTENTION: hack
    try {
        console.log('Starting workflow validation...');
        const result1 = validateWorkflow(Array.from(numericalJobs.values()), numericalWorkflow_1);
        console.log('Validation result 1:', result1);
        console.log('------------------------------------------------------------');
        const result2 = validateWorkflow(Array.from(numericalJobs.values()), numericalWorkflow_2);
        console.log('Validation result 2:', result2);
    } catch (error) {
        console.error('Error during validation:', error);
        throw error;
    }
}