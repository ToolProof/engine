// ATTENTION_RONAK_#: This function validates a workflow against a set of available jobs. While defined here, it's imported by the WorkflowBuilder in the toolproof_core repo to facilitate the validation of workflows while building them. It checks if the jobs specified in the workflow exist in the available jobs, validates input and output bindings, and ensures that all conditions are met. It also tracks initial inputs that are not defined by any previous step. Feel free to copy it over to the toolproof_core repo if you need it there.
export function validateWorkflow(availableJobs, workflow) {
    const jobMap = new Map();
    for (const job of availableJobs) {
        jobMap.set(job.id, job);
    }
    const definedOutputs = new Map();
    const definedAliases = new Set(); // Track output aliases
    const consumedInputs = new Set();
    const initialInputs = new Set();
    let isValid = true;
    function validateStep(step) {
        const job = jobMap.get(step.jobId);
        if (!job) {
            console.error(`[ERROR] Job '${step.jobId}' not found in availableJobs.`);
            isValid = false;
            return;
        }
        const inputRoles = new Set(job.syntacticSpec.inputs.map(i => i.role.name));
        const outputRoles = new Set(job.syntacticSpec.outputs.map(o => o.role.name));
        // Validate input bindings
        for (const [inputRole, sourceOutput] of Object.entries(step.inputBindings)) {
            if (!inputRoles.has(inputRole)) {
                console.error(`[ERROR] Input role '${inputRole}' not found in job '${step.jobId}' inputs.`);
                isValid = false;
            }
            consumedInputs.add(sourceOutput);
            // Check if this output was defined as an alias by a previous step
            if (!definedAliases.has(sourceOutput)) {
                initialInputs.add(sourceOutput);
            }
        }
        // Validate output bindings
        for (const [outputRole, alias] of Object.entries(step.outputBindings)) {
            if (!outputRoles.has(outputRole)) {
                console.error(`[ERROR] Output role '${outputRole}' not found in job '${step.jobId}' outputs.`);
                isValid = false;
            }
            else {
                if (!definedOutputs.has(step.jobId)) {
                    definedOutputs.set(step.jobId, new Set());
                }
                definedOutputs.get(step.jobId).add(outputRole);
                // Track the alias for this output
                if (definedAliases.has(alias)) {
                    console.error(`[ERROR] Output alias '${alias}' is already defined by a previous step.`);
                    isValid = false;
                }
                definedAliases.add(alias);
            }
        }
    }
    // Simple iteration through steps array
    for (const step of workflow.steps) {
        validateStep(step);
    }
    return {
        isValid,
        initialInputs: Array.from(initialInputs)
    };
}
