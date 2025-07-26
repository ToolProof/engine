import { ResourceType, ResourceRole, Concept } from '../types/typesWF.js';
/**
 * Base registry class for managing concepts with common functionality
 */
declare abstract class BaseRegistry<T extends Concept> {
    protected items: Map<string, T>;
    /**
     * Get an item by display name
     */
    get(name: string): T;
    /**
     * Check if an item exists
     */
    has(name: string): boolean;
    /**
     * Get all items
     */
    getAll(): T[];
    /**
     * Find items by partial name match
     */
    findByName(partialName: string): T[];
    protected abstract getItemTypeName(): string;
}
/**
 * Centralized registry for reusable semantic resource types.
 * Resource types are defined once and reused across all jobs and workflows.
 */
declare class ResourceTypeRegistry extends BaseRegistry<ResourceType> {
    protected getItemTypeName(): string;
    /**
     * Define a new resource type in the registry
     */
    define(name: string, description: string, embedding?: number[], format?: string, schema?: object | null): ResourceType;
    /**
     * Find resource types by format
     */
    findByFormat(format: string): ResourceType[];
    /**
     * Bulk define resource types with a fluent API
     */
    defineMany(definitions: Array<{
        name: string;
        description?: string;
        embedding?: number[];
        format?: string;
        schema?: object | null;
    }>): ResourceType[];
}
/**
 * Centralized registry for reusable semantic resource roles.
 * Resource roles define the purpose or function of a resource in a workflow.
 */
declare class ResourceRoleRegistry extends BaseRegistry<ResourceRole> {
    protected getItemTypeName(): string;
    /**
     * Define a new resource role in the registry
     */
    define(name: string, description: string, embedding?: number[]): ResourceRole;
    /**
     * Bulk define resource roles with a fluent API
     */
    defineMany(definitions: Array<{
        name: string;
        description?: string;
        embedding?: number[];
    }>): ResourceRole[];
}
declare const resourceTypeRegistry: ResourceTypeRegistry;
declare const resourceRoleRegistry: ResourceRoleRegistry;
declare const RT: (name: string) => ResourceType;
declare const RR: (name: string) => ResourceRole;
export { BaseRegistry, ResourceTypeRegistry, ResourceRoleRegistry, resourceTypeRegistry, resourceRoleRegistry, RT, RR };
