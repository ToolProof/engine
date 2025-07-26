import { v4 as uuidv4 } from 'uuid';
/**
 * Base registry class for managing concepts with common functionality
 */
class BaseRegistry {
    constructor() {
        this.items = new Map();
    }
    /**
     * Get an item by display name
     */
    get(name) {
        const item = this.items.get(name);
        if (!item) {
            throw new Error(`${this.getItemTypeName()} '${name}' not found in registry. Did you forget to define it?`);
        }
        return item;
    }
    /**
     * Check if an item exists
     */
    has(name) {
        return this.items.has(name);
    }
    /**
     * Get all items
     */
    getAll() {
        return Array.from(this.items.values());
    }
    /**
     * Find items by partial name match
     */
    findByName(partialName) {
        return this.getAll().filter(item => item.name.toLowerCase().includes(partialName.toLowerCase()));
    }
}
/**
 * Centralized registry for reusable semantic resource types.
 * Resource types are defined once and reused across all jobs and workflows.
 */
class ResourceTypeRegistry extends BaseRegistry {
    getItemTypeName() {
        return 'ResourceType';
    }
    /**
     * Define a new resource type in the registry
     */
    define(name, description, embedding = [], format = 'json', schema = null) {
        if (this.items.has(name)) {
            return this.items.get(name);
        }
        const resourceType = {
            id: uuidv4(),
            name: name,
            semanticSpec: {
                description,
                embedding
            },
            syntacticSpec: {
                format,
                schema
            }
        };
        this.items.set(name, resourceType);
        return resourceType;
    }
    /**
     * Find resource types by format
     */
    findByFormat(format) {
        return this.getAll().filter(resourceType => resourceType.syntacticSpec.format === format);
    }
    /**
     * Bulk define resource types with a fluent API
     */
    defineMany(definitions) {
        return definitions.map(def => this.define(def.name, def.description || 'dummy description', def.embedding || [], def.format || 'json', def.schema || null));
    }
}
/**
 * Centralized registry for reusable semantic resource roles.
 * Resource roles define the purpose or function of a resource in a workflow.
 */
class ResourceRoleRegistry extends BaseRegistry {
    getItemTypeName() {
        return 'ResourceRole';
    }
    /**
     * Define a new resource role in the registry
     */
    define(name, description, embedding = []) {
        if (this.items.has(name)) {
            return this.items.get(name);
        }
        const resourceRole = {
            id: uuidv4(),
            name: name,
            semanticSpec: {
                description,
                embedding
            }
        };
        this.items.set(name, resourceRole);
        return resourceRole;
    }
    /**
     * Bulk define resource roles with a fluent API
     */
    defineMany(definitions) {
        return definitions.map(def => this.define(def.name, def.description || 'dummy description', def.embedding || []));
    }
}
// Global registry instances
const resourceTypeRegistry = new ResourceTypeRegistry();
const resourceRoleRegistry = new ResourceRoleRegistry();
// Convenience functions for getting items
const RT = (name) => resourceTypeRegistry.get(name);
const RR = (name) => resourceRoleRegistry.get(name);
// Pre-define common reusable resource types
resourceTypeRegistry.defineMany([
    { name: 'number' },
    { name: 'character' },
]);
// Pre-define common reusable resource roles
resourceRoleRegistry.defineMany([
    { name: 'addend_1', description: 'First number to be added in an addition operation' },
    { name: 'addend_2', description: 'Second number to be added in an addition operation' },
    { name: 'sum', description: 'The result of an addition operation' },
    { name: 'minuend', description: 'The number from which another is subtracted' },
    { name: 'subtrahend', description: 'The number to be subtracted' },
    { name: 'difference', description: 'The result of a subtraction operation' },
    { name: 'multiplicand', description: 'First number to be multiplied' },
    { name: 'multiplier', description: 'Second number to be multiplied' },
    { name: 'product', description: 'The result of a multiplication operation' },
    { name: 'dividend', description: 'The number to be divided' },
    { name: 'divisor', description: 'The number by which another is divided' },
    { name: 'quotient', description: 'The result of a division operation' },
]);
export { BaseRegistry, ResourceTypeRegistry, ResourceRoleRegistry, resourceTypeRegistry, resourceRoleRegistry, RT, RR };
