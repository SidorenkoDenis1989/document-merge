import {
    ActionWithSubsectionsParams,
    Baseline,
    CopyContentWriterParams,
    DifferenceOptions,
    DocumentFields,
    EditContent,
    ExportOptionsDto,
    FieldDefinition,
    ILMConfiguration,
    IntegrityItem,
    MergeDocument,
    MoveContentWriterParams,
    NangaLicenseDto,
    UISettings,
    UserAuthority,
    UserInfo,
} from '@data';
import { axiosApp } from '@config/axios.config';

export type ENDPOINT_TYPE = {
    AUTH: {
        REQUEST_USER: (username: string, password: string, hostId: string | number) => Promise<UserAuthority[]>;
        REVOKE_USER: (hostId: string | number) => Promise<any>;
        GET_CURRENT_USER_ROLES: () => Promise<UserAuthority[]>;
        GET_CURRENT_USER_INFO: () => Promise<UserInfo>;
    };
    PUBLIC: {
        GET_CONNECTIONS: () => Promise<ILMConfiguration[]>;
        GET_AVAILABLE_LANGUAGES: () => Promise<object>;
        GET_DICTIONARY: (language: string) => Promise<object>;
        GET_DOCUMENTS: (hostId: number) => Promise<MergeDocument[]>;
        GET_DOCUMENT_FIELDS: (hostId: number, documentType: string, documentNodeType: string) => Promise<DocumentFields>;
        GET_DOCUMENT_BRANCHES: (hostId: number, documentId: string) => Promise<MergeDocument[]>;
        GET_BASELINES: (hostId: number, documentId: string) => Promise<Baseline[]>;
        GET_CURRENT_VERSION: () => Promise<string>;
        GET_UI_SETTINGS: () => Promise<UISettings>;
    };
    INTEGRITY: {
        GET_INTEGRITY_ITEMS: (options: DifferenceOptions, isHideMergeHistory: boolean) => Promise<IntegrityItem[]>;
        ACCEPT_ALL: (options: DifferenceOptions, isHideMergeHistory: boolean) => Promise<IntegrityItem[]>;
        GET_FIELDS_BY_IDS: (ids: string[], fields: string[], hostId: number) => Promise<object>;
        GET_FIELD_DEFINITIONS: (hostId: number) => Promise<FieldDefinition[]>;
        COPY_INTEGRITY_ITEM: (options: CopyContentWriterParams, hostId: number) => Promise<string>;
        DELETE_INTEGRITY_ITEM: (hostId: number, contentId: string) => Promise<string>;
        MOVE_INTEGRITY_ITEM: (options: MoveContentWriterParams, hostId: number) => Promise<string>;
        ACTION_WITH_SUBSECTIONS: (options: ActionWithSubsectionsParams) => Promise<string>;
        EDIT_INTEGRITY_ITEM: (options: EditContent, hostId: number) => Promise<string>;
        GET_PICK_LIST_VALUES: (hostId: number, fieldName: string) => Promise<string[]>;
    };
    EXPORT_DIFFERENCE: {
        HTML: (options: ExportOptionsDto) => Promise<Blob>;
        XML: (options: ExportOptionsDto) => Promise<Blob>;
        WORD: (options: ExportOptionsDto) => Promise<Blob>;
        PDF: (options: ExportOptionsDto) => Promise<Blob>;
    };
    USER_ACTION: {
        ACCEPT: (item: IntegrityItem, differenceOptions: DifferenceOptions) => Promise<void>;
        DECLINE: (item: IntegrityItem, differenceOptions: DifferenceOptions) => Promise<void>;
    };
    LICENSE: {
        GET(): Promise<NangaLicenseDto>;
        SET(licenseKey): Promise<NangaLicenseDto>;
    };
};

export const ENDPOINT: ENDPOINT_TYPE = {
    AUTH: {
        REQUEST_USER: (username, password, hostId) => {
            return axiosApp.post('/user/login', null, {
                params: {
                    username,
                    password,
                    hostId,
                },
            });
        },
        REVOKE_USER: (hostId) =>
            axiosApp.post('/user/logout', null, {
                params: {
                    hostId,
                },
            }),

        GET_CURRENT_USER_ROLES: () => axiosApp.get('/common/user/roles'),
        GET_CURRENT_USER_INFO: () => axiosApp.get('/common/user/user-info'),
    },
    PUBLIC: {
        GET_CONNECTIONS: () => axiosApp.get('/public/connections'),
        GET_AVAILABLE_LANGUAGES: () => axiosApp.get('/public/available-languages'),
        GET_DICTIONARY: (language) => axiosApp.get(`/public/dictionary?language=${language}`),
        GET_DOCUMENTS: (hostId: number) => axiosApp.get(`/user/documents?hostId=${hostId}`),
        GET_DOCUMENT_BRANCHES: (hostId, documentId) => axiosApp.get(`/user/documents/branches?hostId=${hostId}&documentId=${documentId}`),
        GET_BASELINES: (hostId, documentId) => axiosApp.get(`/user/baselines?hostId=${hostId}&documentId=${documentId}`),
        GET_DOCUMENT_FIELDS: (hostId: number, documentType: string, documentNodeType: string) =>
            axiosApp.get(`/common/documents/fields?hostId=${hostId}&documentType=${documentType}&documentNodeType=${documentNodeType}`),
        GET_CURRENT_VERSION: () => axiosApp.get('/public/version'),
        GET_UI_SETTINGS: () => axiosApp.get('/public/ui-settings'),
    },
    INTEGRITY: {
        GET_INTEGRITY_ITEMS: (options, isHideMergeHistory) =>
            axiosApp.post('/user/documents/differences', options, {
                params: {
                    isHideMergeHistory,
                },
            }),
        ACCEPT_ALL: (options, isHideMergeHistory) =>
            axiosApp.post('/user/documents/accept-all', options, {
                params: {
                    isHideMergeHistory,
                },
            }),
        GET_FIELDS_BY_IDS: (ids, fields, hostId) => axiosApp.post(`/user/fieldsByIds?hostId=${hostId}`, { ids, fields }),
        GET_FIELD_DEFINITIONS: (hostId) => axiosApp.get(`user/fieldDefinition?hostId=${hostId}`),
        COPY_INTEGRITY_ITEM: (params, hostId) => axiosApp.post(`/user/documents/item/copy?hostId=${hostId}`, params),
        DELETE_INTEGRITY_ITEM: (hostId, contentId) => axiosApp.delete(`/user/document/content?hostId=${hostId}&contentId=${contentId}`),
        MOVE_INTEGRITY_ITEM: (params, hostId) => axiosApp.put(`/user/documents/item/move?hostId=${hostId}`, params),
        ACTION_WITH_SUBSECTIONS: (params) =>
            axiosApp.put(`/user/documents/action-with-subsections`, params),
        EDIT_INTEGRITY_ITEM: (params, hostId) => axiosApp.put(`/user/document/field?hostId=${hostId}`, params),
        GET_PICK_LIST_VALUES: (hostId, fieldName) => axiosApp.get(`user/fieldPickListValues?hostId=${hostId}&fieldName=${fieldName}`),
    },
    EXPORT_DIFFERENCE: {
        HTML: (options) =>
            axiosApp.post(`/user/documents/export/html`, options, {
                responseType: 'blob',
            }),
        XML: (options) =>
            axiosApp.post(`/user/documents/export/xml`, options, {
                responseType: 'blob',
            }),
        WORD: (options) =>
            axiosApp.post(`/user/documents/export/word`, options, {
                responseType: 'blob',
            }),
        PDF: (options) =>
            axiosApp.post(`/user/documents/export/pdf`, options, {
                responseType: 'blob',
            }),
    },
    USER_ACTION: {
        ACCEPT: (item: IntegrityItem, differenceOptions: DifferenceOptions) => axiosApp.post('/user/documents/item/accept', { item, differenceOptions }),
        DECLINE: (item: IntegrityItem, differenceOptions: DifferenceOptions) => axiosApp.post('/user/documents/item/decline', { item, differenceOptions }),
    },
    LICENSE: {
        GET: () => axiosApp.get(`/admin/license`),
        SET: (licenseKey: string) => axiosApp.post(`/admin/license`, { licenseKey }),
    },
};
