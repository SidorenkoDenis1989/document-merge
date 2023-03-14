import { inject, injectable } from 'inversify';
import type { ENDPOINT_TYPE } from '@data';
import { IntegrityItem, TYPES } from '@data';
import { IntegrityScope } from '@scope';

export interface UserActionService {
    accept(item: IntegrityItem): Promise<void>;
    decline(item: IntegrityItem): Promise<void>;
}

@injectable()
export class UserActionServiceImpl implements UserActionService {
    constructor(@inject(TYPES.ENDPOINTS) private ENDPOINTS: ENDPOINT_TYPE, @inject(TYPES.INTEGRITY_SCOPE) private integrityScope: IntegrityScope) {}

    accept(item: IntegrityItem): Promise<void> {
        return this.ENDPOINTS.USER_ACTION.ACCEPT(item, this.integrityScope.differenceOptions);
    }

    decline(item: IntegrityItem): Promise<void> {
        return this.ENDPOINTS.USER_ACTION.DECLINE(item, this.integrityScope.differenceOptions);
    }
}
