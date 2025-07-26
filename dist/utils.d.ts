import { Job, Workflow } from './types/typesWF.js';
interface ValidationResult {
    isValid: boolean;
    initialInputs: string[];
}
export declare function validateWorkflow(availableJobs: Job[], workflow: Workflow): ValidationResult;
export {};
