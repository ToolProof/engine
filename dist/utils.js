export const calculateExecutionLevels = (workflow) => {
    const levels = new Map();
    const visited = new Set();
    const processing = new Set();
    // Helper function to calculate the maximum dependency level for a job
    const calculateLevel = (jobId) => {
        if (processing.has(jobId)) {
            // Circular dependency detected, treat as level 0
            return 0;
        }
        if (visited.has(jobId)) {
            return levels.get(jobId) || 0;
        }
        processing.add(jobId);
        // Find all edges that lead TO this node (dependencies)
        const incomingEdges = workflow.edges.filter(edge => edge.to === jobId);
        if (incomingEdges.length === 0) {
            // No dependencies, this is a starting job (level 0)
            levels.set(jobId, 0);
            visited.add(jobId);
            processing.delete(jobId);
            return 0;
        }
        // Calculate the maximum level of all dependencies + 1
        let maxDependencyLevel = -1;
        for (const edge of incomingEdges) {
            const dependencyLevel = calculateLevel(edge.from);
            maxDependencyLevel = Math.max(maxDependencyLevel, dependencyLevel);
        }
        const jobLevel = maxDependencyLevel + 1;
        levels.set(jobId, jobLevel);
        visited.add(jobId);
        processing.delete(jobId);
        return jobLevel;
    };
    // Calculate levels for all jobs
    workflow.jobs.forEach(wn => {
        calculateLevel(wn.job.id);
    });
    return levels;
};
export function validateWorkflow(availableJobs, workflow) {
    const jobMap = new Map();
    for (const job of availableJobs) {
        jobMap.set(job.id, job);
    }
    const definedOutputs = new Map();
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
        const inputRoles = new Set(job.syntacticSpec.inputs.map(i => i.role.id));
        const outputRoles = new Set(job.syntacticSpec.outputs.map(o => o.role.id));
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
            if (!definedOutputs.get(exch.sourceJobId)?.has(exch.sourceOutput)) {
                initialInputs.add(exch.sourceOutput);
            }
        }
        for (const outputRole of Object.keys(step.resultBindings)) {
            if (!outputRoles.has(outputRole)) {
                console.error(`[ERROR] Output role '${outputRole}' not found in job '${step.jobId}' outputs.`);
                isValid = false;
            }
            else {
                if (!definedOutputs.has(step.jobId)) {
                    definedOutputs.set(step.jobId, new Set());
                }
                definedOutputs.get(step.jobId).add(outputRole);
            }
        }
    }
    function walkSteps(steps) {
        for (const s of steps) {
            if (s.type === 'simple') {
                validateStep(s.step);
            }
            else if (s.type === 'parallel') {
                const seenOutputs = new Set();
                for (const branch of s.branches) {
                    const branchOutputs = new Set();
                    for (const bStep of branch) {
                        if (bStep.type === 'simple') {
                            for (const bound of Object.values(bStep.step.resultBindings)) {
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
