import { ResourceFormat, ResourceRoleName, ResourceType, ResourceRole, Concept } from '../types/typesWF.js';
import { v4 as uuidv4 } from 'uuid';


// ATTENTION_RONAK: In this module, ResourceType and ResourceRole registries are defined for calculator and adapter_autodock jobs. These registries are used to define reusable semantic resource types and roles that can be shared across multiple jobs and workflows. Later, UI/AI-agent + validatorUrl will take care of this. You don't need to do anything here. I'm guiding you here just for your understanding.

/**
 * Base registry class for managing concepts with common functionality
 */
abstract class BaseRegistry<T extends string, C extends Concept<T>> {
    protected items = new Map<T, C>();

    /**
     * Get an item by name
     */
    get(name: T): C {
        const item = this.items.get(name);
        if (!item) {
            throw new Error(`${this.getSubClassName()} '${name}' not found in registry. Did you forget to define it?`);
        }
        return item;
    }

    /**
     * Check if an item exists
     */
    has(name: T): boolean {
        return this.items.has(name);
    }

    /**
     * Get all items
     */
    getAll(): C[] {
        return Array.from(this.items.values());
    }

    /**
     * Find items by partial name match
     */
    findByName(partialName: string): C[] {
        return this.getAll().filter(item =>
            item.name.toLowerCase().includes(partialName.toLowerCase())
        );
    }

    protected abstract getSubClassName(): string;
}

/**
 * Centralized registry for resource types.
 * Resource types are defined once and reused across all jobs and workflows.
 */
class ResourceTypeRegistry extends BaseRegistry<ResourceTypeName, ResourceType> {
    protected getSubClassName(): string {
        return 'ResourceType';
    }

    /**
     * Define a new resource type in the registry
     */
    define(
        name: ResourceTypeName,
        description: string,
        format: ResourceFormat = 'json',
        schemaUrl: string = 'default-schemaUrl',
        validatorUrl: string = 'default-validatorUrl',
        extractorUrl: string = 'default-extractorUrl'
    ): ResourceType {
        if (this.items.has(name)) {
            return this.items.get(name)!;
        }

        const resourceType: ResourceType = {
            id: uuidv4(),
            name,
            description,
            format,
            schemaUrl: schemaUrl,
            validatorUrl: validatorUrl,
            extractorUrl: extractorUrl
        };

        this.items.set(name, resourceType);

        return resourceType;
    }

    /**
     * Bulk define resource types with a fluent API
     */
    defineMany(definitions: Array<{
        name: ResourceTypeName;
        description: string;
        format?: ResourceFormat;
        schemaUrl?: string;
        validatorUrl?: string;
        extractorUrl?: string;
    }>): ResourceType[] {
        return definitions.map(def =>
            this.define(
                def.name,
                def.description,
                def.format || 'json',
                def.schemaUrl || 'default-schemaUrl',
                def.validatorUrl || 'default-validatorUrl',
                def.extractorUrl || 'default-extractorUrl'
            )
        );
    }

    /**
     * Find resource types by format
     */
    findByFormat(format: string): ResourceType[] {
        return this.getAll().filter(resourceType => resourceType.format === format);
    }

}

/**
 * Centralized registry for reusable resources.
 * Resources define the purpose or function of a resource in a workflow.
 */
type ResourceRoleWithoutType = Omit<ResourceRole, 'type'>;

class ResourceRoleRegistry extends BaseRegistry<ResourceRoleName, ResourceRoleWithoutType> {
    protected getSubClassName(): string {
        return 'ResourceRole';
    }

    /**
     * Define a new resource in the registry
     */
    define(
        name: ResourceRoleName,
        description: string,
    ): ResourceRoleWithoutType {
        if (this.items.has(name)) {
            return this.items.get(name)!;
        }

        const resource: ResourceRoleWithoutType = {
            id: uuidv4(),
            name,
            description,
        };

        this.items.set(name, resource);
        return resource;
    }

    /**
     * Bulk define resources with a fluent API
     */
    defineMany(definitions: Array<{
        name: ResourceRoleName;
        description: string;
    }>): ResourceRoleWithoutType[] {
        return definitions.map(def =>
            this.define(
                def.name,
                def.description
            )
        );
    }
}

// Global registry instances
const resourceTypeRegistry = new ResourceTypeRegistry();
const resourceRoleRegistry = new ResourceRoleRegistry();

// Convenience functions for getting items
const RT = (name: ResourceTypeName) => resourceTypeRegistry.get(name);
const RR = (name: ResourceRoleName, type: ResourceType): ResourceRole => {
    const resource = resourceRoleRegistry.get(name);

    return {
        ...resource,
        type, // ✅ inject the ResourceType here
    };
};


// Pre-define common reusable resource types

// For calculator jobs
export const resourceTypesCalculator = [
    {
        name: 'number',
        description: 'A number resource type.',
        format: 'json' as ResourceFormat,
        schemaUrl: 'default-schemaUrl',
        validatorUrl: 'default-validatorUrl',
        extractorUrl: 'default-extractorUrl'
    }
];

type CalculatorResourceTypeName = typeof resourceTypesCalculator[number]['name'];

resourceTypeRegistry.defineMany(resourceTypesCalculator);

// For adapter_autodock jobs
export const resourceTypesAutodockAdapter = [
    {
        name: 'smiles',
        description: 'SMILES representation of a molecule.',
        format: 'txt' as ResourceFormat,
        schemaUrl: 'default-schemaUrl',
        validatorUrl: 'default-validatorUrl',
        extractorUrl: 'default-extractorUrl'
    },
    {
        name: 'pdb',
        description: 'PDB representation of a molecule.',
        format: 'pdb' as ResourceFormat,
        schemaUrl: 'default-schemaUrl',
        validatorUrl: 'default-validatorUrl',
        extractorUrl: 'default-extractorUrl'
    },
    {
        name: 'pdbqt_autodock',
        description: 'PDBQT representation of a molecule.',
        format: 'pdbqt' as ResourceFormat,
        schemaUrl: 'default-schemaUrl',
        validatorUrl: 'default-validatorUrl',
        extractorUrl: 'default-extractorUrl'
    },
    {
        name: 'sdf',
        description: 'SDF representation of a molecule.',
        format: 'sdf' as ResourceFormat,
        schemaUrl: 'default-schemaUrl',
        validatorUrl: 'default-validatorUrl',
        extractorUrl: 'default-extractorUrl'
    }
];

type AutodockAdapterResourceTypeName = typeof resourceTypesAutodockAdapter[number]['name'];

resourceTypeRegistry.defineMany(resourceTypesAutodockAdapter);

export type ResourceTypeName = CalculatorResourceTypeName | AutodockAdapterResourceTypeName;

// Pre-define common reusable resources

// For calculator jobs
resourceRoleRegistry.defineMany([
    {
        name: 'addend_1',
        description: 'First number to be added'
    },
    {
        name: 'addend_2',
        description: 'Second number to be added'
    },
    {
        name: 'sum',
        description: 'Sum result'
    },
    {
        name: 'minuend',
        description: 'Number to subtract from'
    },
    {
        name: 'subtrahend',
        description: 'Number to subtract'
    },
    {
        name: 'difference',
        description: 'Subtraction result'
    },
    {
        name: 'multiplicand',
        description: 'First number to be multiplied'
    },
    {
        name: 'multiplier',
        description: 'Second number to be multiplied'
    },
    {
        name: 'product',
        description: 'Multiplication result'
    },
    {
        name: 'dividend',
        description: 'Number to be divided'
    },
    {
        name: 'divisor',
        description: 'Number to divide by'
    },
    {
        name: 'quotient',
        description: 'Division result'
    },
]);

// For adapter_autodock jobs
resourceRoleRegistry.defineMany([
    {
        name: 'ligand',
        description: 'The molecule to be docked'
    },
    {
        name: 'receptor',
        description: 'The target molecule for docking'
    },
    {
        name: 'box',
        description: 'The docking box specification'
    },
    {
        name: 'ligand_docking',
        description: 'Docked ligand output'
    },
    {
        name: 'ligand_pose',
        description: 'Pose of the ligand after docking'
    },
    {
        name: 'receptor_pose',
        description: 'Pose of the receptor after preparation'
    }
]);


export {
    BaseRegistry,
    ResourceTypeRegistry,
    ResourceRoleRegistry,
    resourceTypeRegistry,
    resourceRoleRegistry,
    RT,
    RR
};
