import { injectable, inject } from 'inversify';
import type { ENDPOINT_TYPE } from '@data';
import { TYPES } from '@data';
import { getActiveHostId } from '@utils';
import { FieldDefinition } from '@data';

export interface FieldsDefinitionsService {
    getFieldDefinition(): Promise<FieldDefinition[]>;
    getSortedDefinitionByFields(fields: string[]): Promise<FieldDefinition[]>;
    getFieldDefinitionByFields(fields: string[]): Promise<FieldDefinition[]>;
}

@injectable()
export class FieldsDefinitionsServiceImpl implements FieldsDefinitionsService {
    private readonly fieldDefinition: Map<number, Promise<FieldDefinition[]>> = new Map();

    constructor(@inject(TYPES.ENDPOINTS) private ENDPOINTS: ENDPOINT_TYPE) {}

    getFieldDefinition(): Promise<FieldDefinition[]> {
        const hostId = getActiveHostId();
        const cached = this.fieldDefinition.get(hostId);
        if (cached) {
            return cached;
        }
        const promise = this.ENDPOINTS.INTEGRITY.GET_FIELD_DEFINITIONS(hostId);
        this.fieldDefinition.set(hostId, promise);
        promise.catch(() => this.fieldDefinition.delete(hostId));
        return promise;
    }

    async getFieldDefinitionByFields(fields: string[]): Promise<FieldDefinition[]> {
        const fieldsDefinitions = await this.getFieldDefinition();
        return fieldsDefinitions.filter((definition) => fields.some((name) => name === definition.name));
    }

    async getSortedDefinitionByFields(fields: string[]): Promise<FieldDefinition[]> {
        const fieldsDefinitions = await this.getFieldDefinitionByFields(fields);
        fieldsDefinitions.sort(this.compareFieldDefinition);
        return fieldsDefinitions;
    }

    private compareFieldDefinition(definitionA: FieldDefinition, definitionB: FieldDefinition): number {
        if (definitionA.displayName.toUpperCase() > definitionB.displayName.toUpperCase()) {
            return 1;
        }
        if (definitionA.displayName.toUpperCase() < definitionB.displayName.toUpperCase()) {
            return -1;
        }
        return 0;
    }
}
