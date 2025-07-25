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
        // Find all workflowedges that lead TO this job (dependencies)
        const incomingWorkflowedges = workflow.workflowEdges.filter(workflowedge => workflowedge.to === jobId);
        if (incomingWorkflowedges.length === 0) {
            // No dependencies, this is a starting job (level 0)
            levels.set(jobId, 0);
            visited.add(jobId);
            processing.delete(jobId);
            return 0;
        }
        // Calculate the maximum level of all dependencies + 1
        let maxDependencyLevel = -1;
        for (const workflowedge of incomingWorkflowedges) {
            const dependencyLevel = calculateLevel(workflowedge.from);
            maxDependencyLevel = Math.max(maxDependencyLevel, dependencyLevel);
        }
        const jobLevel = maxDependencyLevel + 1;
        levels.set(jobId, jobLevel);
        visited.add(jobId);
        processing.delete(jobId);
        return jobLevel;
    };
    // Calculate levels for all jobs
    workflow.workflowNodes.forEach(wn => {
        calculateLevel(wn.job.id);
    });
    return levels;
};
