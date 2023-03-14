import {Baseline, DocumentFields, ILMConfiguration, MergeDocument, UISettings, UserInfo} from '@data';
import {FieldDefinition} from "@data/entity/field-definition.entity";

export const ilmConnectionsMock: ILMConfiguration[] = [
    {
        id: 1,
        host: '192.168.43.57',
        port: 7001,
        label: 'Production Server',
    },
    {
        id: 2,
        host: '192.168.0.101',
        port: 7001,
        label: 'Test Server',
    },
];

export const availableLanguageMock = {
    en: 'English',
    de: 'Deutsch'
};

export const userInfoMock: UserInfo = {
    userName: 'Admin'
};

export const dictionaryMock = {
    submit: 'Submit',
    signOut: 'Sign Out',
    username: 'Username',
    password: 'Password',
    email: 'Email',
    loginTitle: 'Please Login',
    integrityHostTitle: 'Integrity Host',
    licensing: 'Licensing',
    licenseStatus: 'License Status',
    licenseCompanyName: 'Company Name',
    licenseExpirationDate: 'Expiration date',
    licenseVolume: 'License volume',
    licenseCode: 'License Code',
    licensePlaceholder: 'Paste license code here',
    saveChanges: 'Save Changes',
    back: 'Back',
    mergeTo: 'Merge to',
    mergeFrom: 'Merge from',
    baselineDateLabel: 'Baseline / Date',
    fieldsForComparison: 'Fields for Comparison',
    updateView: 'Update view',
    field: 'Field',
    fields: 'Fields',
    fieldColumnName: 'Field',
    oldValueColumnName: 'Old Value',
    newValueColumnName: 'New Value',
    UISettingsHeader: 'UI Settings',
    languageLabel: 'Language:',
    themeModeLabel: 'Dark theme',
    loadingText: 'Loading...',
    mergeViewTitle: 'Merge View',
    aboutTitle: 'About',
    documentationTitle: 'Documentation',
    settingsTitle: 'Settings',
    preferencesTitle: 'Preferences',
    accept: "Accept",
    decline: "Decline",
    acceptAsSelected: "Accept as selected",
    login: "Log in",
    valid: "Valid",
    invalid: "Invalid",
    paste: "Paste",
    cancel: "Cancel",
    ok: "Ok",
    unchangedItems: "Unchanged items",
    invisible: "Invisible",
    visible: "Visible",
    jumpToNewPosition: "Jump to new position",
    jumpToOldPosition: "Jump to old position",
    showFollowingChanges: "Show following changes",
    new: "New",
    deleted: "Deleted",
    changed: "Changed",
    moved: "Moved",
    previous: "Previous",
    next: "Next",
    exportAsWord: "Export as Word",
    exportAsPDF: "Export as PDF",
    exportAsHTML: "Export as HTML",
    exportAsXML: "Export as XML",
    exportTheGeneratedDiff: "Export the generated diff",
    deleteDialogTitle: "Remove document content",
    deleteDialogText: "Are you sure?",
    mergeAllConfirmation: "Merge all changes",
    mergeAllConfirmationDialogText: "Are you sure you want to merge all the changes? This step cannot be reverted",
    light: "Light",
    dark: "Dark",
    uiTheme: "UI Theme",
    language: "Language",
    connection: "Connection",
    server: "Server",
    user: "User",
    noOptions: "No options",
    noPossibleBaselineMerge: "Merge into a baseline is not possible. With the baseline selected, the merge functionality is deactivated. You can only export the diff",
    ignoreMergeHistory: "Ignore Merge History"
};


export const documents: MergeDocument[] = [{
    id: '331',
    type: 'Required Document',
    nodeType: 'Required Document Type',
    state: 'Proposed',
    documentShortTitle: 'Document Title',
    mergeDropdownTitle: 'Document Title ID 331'
}];

export const baselines: Baseline[] = [
    {label: 'Document Title ID 331'},
    {label: 'Document Title ID 332'},
    {label: 'Document Title ID 333'}
];

export const documentFields: DocumentFields = {
    allFields: [
        "ID",
        "Category",
        "Title",
    ],
    defaultCompareFields: [
        "ID",
        "Title"
    ]

};

export const documentFieldsDefinitions: FieldDefinition[] = [
    {
        name: "ID",
        displayName: "ID",
        type: "SHORTTEXT"
    },
    {
        name: "Category",
        displayName: "Category",
        type: "SHORTTEXT"
    },
    {
        name: "Title",
        displayName: "Title",
        type: "SHORTTEXT"
    }
];

export const uiSettingsMock: UISettings = {
    documentation: {
        visible: true,
        url: 'https://products.nangasystems.com/index.action'
    },
    dateFormat: "MMM d, yyyy h:mm:ss a",
};

export const projectVersion = '1.3.0-RELEASE';

window['ilmConnectionsMock'] = ilmConnectionsMock;
