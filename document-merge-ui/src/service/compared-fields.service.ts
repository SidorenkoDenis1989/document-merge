import { injectable, inject } from 'inversify';
import type { DocumentFields, ENDPOINT_TYPE } from '@data';
import { TYPES } from '@data';
import { getActiveHostId, ObjectMap } from '@utils';

export interface ComparedFieldsService {
    getFields(type: string, nodeType: string): Promise<DocumentFields>;
}

@injectable()
export class ComperedFieldsServiceImpl implements ComparedFieldsService {
    private readonly fields: ObjectMap<ComperedFieldsKey, Promise<DocumentFields>> = new ObjectMap();

    constructor(@inject(TYPES.ENDPOINTS) private ENDPOINTS: ENDPOINT_TYPE) {}

    getFields(type: string, nodeType: string): Promise<DocumentFields> {
        const key = new ComperedFieldsKey(getActiveHostId(), type, nodeType);
        const cached = this.fields.get(key);
        if (cached) {
            return cached;
        }
        const promise = this.ENDPOINTS.PUBLIC.GET_DOCUMENT_FIELDS(key.hostId, key.type, key.nodeType);
        this.fields.set(key, promise);
        promise.catch(() => this.fields.delete(key));
        return promise;
    }
}

class ComperedFieldsKey {
    hostId: number;
    type: string;
    nodeType: string;

    constructor(hostId: number, type: string, nodeType: string) {
        this.hostId = hostId;
        this.type = type;
        this.nodeType = nodeType;
    }

    equals(obj: ComperedFieldsKey) {
        return this.hostId === obj.hostId && this.type === obj.type && this.nodeType === obj.nodeType;
    }
}
