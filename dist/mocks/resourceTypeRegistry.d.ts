import { ResourceType } from '../types';
/**
 * Centralized registry for reusable semantic resource types.
 * Resource types are defined once and reused across all jobs and workflows.
 */
declare class ResourceTypeRegistry {
    private resourceTypes;
    /**
     * Define a new resource type in the registry
     */
    define(displayName: string, description: string, embedding?: number[], format?: string, schema?: object | null): ResourceType;
    /**
     * Get a resource type by display name
     */
    get(displayName: string): ResourceType;
    /**
     * Check if a resource type exists
     */
    has(displayName: string): boolean;
    /**
     * Get all resource types
     */
    getAll(): ResourceType[];
    /**
     * Find resource types by format
     */
    findByFormat(format: string): ResourceType[];
    /**
     * Find resource types by partial name match
     */
    findByDisplayName(partialName: string): ResourceType[];
    /**
     * Bulk define resource types with a fluent API
     */
    defineMany(definitions: Array<{
        displayName: string;
        description?: string;
        embedding?: number[];
        format?: string;
        schema?: object | null;
    }>): ResourceType[];
}
declare const resourceTypeRegistry: ResourceTypeRegistry;
declare const RT: (displayName: string) => ResourceType;
export { ResourceTypeRegistry, resourceTypeRegistry, RT };
