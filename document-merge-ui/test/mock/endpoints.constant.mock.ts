import { ENDPOINT_TYPE } from '@data';
import {
    ilmConnectionsMock,
    dictionaryMock,
    availableLanguageMock,
    documents,
    baselines,
    documentFields,
    projectVersion,
    uiSettingsMock,
    documentFieldsDefinitions,
    userInfoMock,
} from '@test/mock/data.mock';
import { INTEGRITY_ITEM } from '@test';

export const mockRequest = (data, ms = 1000): typeof data => {
    return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

export const MOCK_ENDPOINT: ENDPOINT_TYPE = {
    AUTH: {
        REQUEST_USER: function (username: string, password: string, hostId: string) {
            return mockRequest({ role: 'USER' });
        },
        REVOKE_USER: function () {
            return mockRequest({});
        },
        GET_CURRENT_USER_ROLES: function () {
            return mockRequest(['USER', 'ADMIN']);
        },
        GET_CURRENT_USER_INFO: function () {
            return mockRequest(userInfoMock);
        },
    },
    PUBLIC: {
        GET_CONNECTIONS: () => mockRequest(ilmConnectionsMock),
        GET_AVAILABLE_LANGUAGES: () => mockRequest(availableLanguageMock),
        GET_DICTIONARY: () => mockRequest(dictionaryMock),
        GET_DOCUMENTS: () => mockRequest(documents),
        GET_BASELINES: () => mockRequest(baselines),
        GET_DOCUMENT_BRANCHES: (hostId, documentId) => mockRequest([]),
        GET_DOCUMENT_FIELDS: () => mockRequest(documentFields),
        GET_CURRENT_VERSION: () => mockRequest(projectVersion),
        GET_UI_SETTINGS: () => mockRequest(uiSettingsMock),
    },
    INTEGRITY: {
        GET_INTEGRITY_ITEMS: function () {
            return mockRequest(INTEGRITY_ITEM);
        },
        GET_FIELD_DEFINITIONS: (hostId) => mockRequest(documentFieldsDefinitions),
    },
    LICENSE: {
        GET: () => mockRequest({}),
        SET: (licenseKey: string) => mockRequest({}),
    },
};
