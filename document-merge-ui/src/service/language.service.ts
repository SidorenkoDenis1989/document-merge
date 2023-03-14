import { injectable, inject } from 'inversify';
import { TYPES } from '@data';
import { ApplicationInfoScope } from '@scope';
import type { ENDPOINT_TYPE } from '@data';

export interface LanguageService {
    getAvailableLanguages(): Promise<object>;
    getDictionary(language: string): Promise<object>;
}

@injectable()
export class LanguageServiceImpl implements LanguageService {
    constructor(@inject(TYPES.APPLICATION_INFO_SCOPE) private appInfoScope: ApplicationInfoScope, @inject(TYPES.ENDPOINTS) private ENDPOINTS: ENDPOINT_TYPE) {}

    getAvailableLanguages(): Promise<object> {
        return this.ENDPOINTS.PUBLIC.GET_AVAILABLE_LANGUAGES().then((data) => {
            this.appInfoScope.availableLanguages = data;
            return data;
        });
    }

    getDictionary(language: string): Promise<object> {
        return this.ENDPOINTS.PUBLIC.GET_DICTIONARY(language);
    }
}
