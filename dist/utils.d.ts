import { Job, Workflow } from './types';
export declare const calculateExecutionLevels: (workflow: Workflow) => Map<string, number>;
interface ValidationResult {
    isValid: boolean;
    initialInputs: string[];
}
export declare function validateWorkflow(availableJobs: Job[], workflow: Workflow): ValidationResult;
export {};
