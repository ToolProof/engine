import { Workflow } from './types';

export const calculateExecutionLevels = (workflow: Workflow): Map<string, number> => {
    const levels = new Map<string, number>();
    const visited = new Set<string>();
    const processing = new Set<string>();

    // Helper function to calculate the maximum dependency level for a job
    const calculateLevel = (jobId: string): number => {
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
}