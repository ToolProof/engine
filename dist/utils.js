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
        for (const exch of step.dataExchanges) {
            if (exch.targetJobId !== step.jobId) {
                console.error(`[ERROR] DataExchange targetJobId '${exch.targetJobId}' does not match step.jobId '${step.jobId}'`);
                isValid = false;
            }
            if (!inputRoles.has(exch.targetInput)) {
                console.error(`[ERROR] Target input role '${exch.targetInput}' not found in job '${step.jobId}' inputs.`);
                isValid = false;
            }
            consumedInputs.add(exch.sourceOutput);
            // Check if this output was defined as an alias by a previous step
            if (!definedAliases.has(exch.sourceOutput)) {
                initialInputs.add(exch.sourceOutput);
            }
        }
        for (const outputRole of Object.keys(step.outputBindings)) {
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
                const alias = step.outputBindings[outputRole];
                definedAliases.add(alias);
            }
        }
    }
    function walkSteps(steps) {
        for (const s of steps) {
            if (s.type === 'actual') {
                validateStep(s.step);
            }
            else if (s.type === 'parallel') {
                const seenOutputs = new Set();
                for (const branch of s.branches) {
                    const branchOutputs = new Set();
                    for (const bStep of branch) {
                        if (bStep.type === 'actual') {
                            for (const bound of Object.values(bStep.step.outputBindings)) {
                                if (branchOutputs.has(bound)) {
                                    console.error(`[ERROR] Duplicate output alias '${bound}' in same branch.`);
                                    isValid = false;
                                }
                                branchOutputs.add(bound);
                            }
                        }
                    }
                    for (const out of branchOutputs) {
                        if (seenOutputs.has(out)) {
                            console.error(`[ERROR] Output alias '${out}' appears in multiple parallel branches.`);
                            isValid = false;
                        }
                        seenOutputs.add(out);
                    }
                    walkSteps(branch);
                }
            }
            else if (s.type === 'conditional') {
                for (const branch of s.branches) {
                    walkSteps(branch.steps);
                }
            }
            else if (s.type === 'while') {
                walkSteps(s.body);
            }
            else if (s.type === 'for') {
                walkSteps(s.body);
            }
        }
    }
    walkSteps(workflow.steps);
    return {
        isValid,
        initialInputs: Array.from(initialInputs)
    };
}
