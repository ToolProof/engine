import { runRemoteGraph as runWorkflowRunner } from './testClients/clientWorkflowRunner.js';
import { validateWorkflow } from './utils.js';
import { calculatorJobs, calculatorWorkflowSpec_1, calculatorWorkflowSpec_2 } from './mocks/calculator.js';
import { adapterAutodockJobs, adapterAutodockWorkflowSpec_1 } from './mocks/adapter_autodock.js';


if (process.env.NODE_ENV === 'workflowRunner') {
    runWorkflowRunner();
}

// ATTENTION_RONAK_#: Run 'npm run start:workflowValidator' to see the validation results of the hardcoded workflows. The results will tell you whether the workflows are valid and list the initial inputs they need. Note that 'sum' isn't needed as an initial input for calculatorWorkflowSpec_2, which is a workflow with a while loop. Since it isn't provided for the first iteration, NodeHigh will use 'num_one.json' as a placeholder.
if (process.env.NODE_ENV === 'workflowValidator') {
    try {
        console.log('Starting workflow validation...');
        const result1 = validateWorkflow(Array.from(calculatorJobs.values()), calculatorWorkflowSpec_1.workflow);
        console.log('Validation result 1:', result1);
        console.log('------------------------------------------------------------');
        const result2 = validateWorkflow(Array.from(calculatorJobs.values()), calculatorWorkflowSpec_2.workflow);
        console.log('Validation result 2:', result2);
        console.log('------------------------------------------------------------');
        const result3 = validateWorkflow(Array.from(adapterAutodockJobs.values()), adapterAutodockWorkflowSpec_1.workflow);
        console.log('Validation result 3:', result3);
    } catch (error) {
        console.error('Error during validation:', error);
        throw error;
    }
}