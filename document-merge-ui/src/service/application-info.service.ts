import {inject, injectable} from 'inversify';
import type {ENDPOINT_TYPE} from '@data';
import {Baseline, ILMConfiguration, MergeDocument, TYPES, UISettings} from '@data';
import {ApplicationInfoScope} from '@scope';
import {getActiveHostId} from '@utils';

export interface ApplicationInfoService {
    getHosts(): Promise<ILMConfiguration[]>;

    getCurrentHost(): Promise<ILMConfiguration>;

    setIsVisibleNavBar(isVisibleNavBar: boolean): void;

    getDocuments(): Promise<MergeDocument[]>;

    getDocumentBranches(documentId: string): Promise<MergeDocument[]>;

    getBaselines(documentId: string): Promise<Baseline[]>;

    getProjectVersion(): Promise<string>;

    getUISettings(): Promise<UISettings>;
}

@injectable()
export class ApplicationInfoServiceImpl implements ApplicationInfoService {
    constructor(
        @inject(TYPES.APPLICATION_INFO_SCOPE) private applicationInfoScope: ApplicationInfoScope,
        @inject(TYPES.ENDPOINTS) private ENDPOINTS: ENDPOINT_TYPE,
    ) {
    }

    getHosts(): Promise<ILMConfiguration[]> {
        const { hosts } = this.applicationInfoScope;
        if (hosts) {
            return Promise.resolve(hosts);
        }
        return this.ENDPOINTS.PUBLIC.GET_CONNECTIONS().then((hosts) => {
            this.applicationInfoScope.hosts = hosts;
            return hosts;
        });
    }

    async getCurrentHost(): Promise<ILMConfiguration> {
        const hostId = getActiveHostId();
        const hosts = await this.getHosts();
        return hosts.find((host) => host.id === hostId);
    }

    setIsVisibleNavBar(isVisibleNavBar: boolean): void {
        this.applicationInfoScope.isVisibleNavBar = isVisibleNavBar;
    }

    getDocuments(): Promise<MergeDocument[]> {
        const { documents } = this.applicationInfoScope;
        if (documents) {
            return Promise.resolve(documents);
        }
        return this.ENDPOINTS.PUBLIC.GET_DOCUMENTS(getActiveHostId()).then((documents) => {
            this.applicationInfoScope.documents = documents;
            return documents;
        });
    }

    getDocumentBranches(documentId: string): Promise<MergeDocument[]> {
        return this.ENDPOINTS.PUBLIC.GET_DOCUMENT_BRANCHES(getActiveHostId(), documentId);
    }

    getBaselines(documentId: string): Promise<Baseline[]> {
        return this.ENDPOINTS.PUBLIC.GET_BASELINES(getActiveHostId(), documentId);
    }

    getProjectVersion(): Promise<string> {
        return this.ENDPOINTS.PUBLIC.GET_CURRENT_VERSION().then((version) => version);
    }

    getUISettings(): Promise<UISettings> {
        return this.ENDPOINTS.PUBLIC.GET_UI_SETTINGS().then((settings) => {
            this.applicationInfoScope.documentation = settings.documentation;
            this.applicationInfoScope.dateFormat = settings.dateFormat;
            this.applicationInfoScope.readOnlyFields = settings.readOnlyFields;
            return settings;
        });
    }
}
