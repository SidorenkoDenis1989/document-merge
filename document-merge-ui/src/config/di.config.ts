import 'reflect-metadata';
import { Container } from 'inversify';
import { ENDPOINT, ENDPOINT_TYPE, TYPES } from '@data';
import {
    ApplicationInfoService,
    ApplicationInfoServiceImpl,
    ComparedFieldsService,
    ComperedFieldsServiceImpl,
    DialogService,
    DialogServiceImpl,
    DocumentContentWriterService,
    DocumentContentWriterServiceImpl,
    ExportService,
    ExportServiceImpl,
    FieldsDefinitionsService,
    FieldsDefinitionsServiceImpl,
    FilterService,
    FilterServiceImpl,
    IntegrityItemEditorService,
    IntegrityItemEditorServiceImpl,
    IntegrityLinkService,
    IntegrityLinkServiceImpl,
    IntegrityService,
    IntegrityServiceImpl,
    LanguageService,
    LanguageServiceImpl,
    LicenseService,
    LicenseServiceImpl,
    LocalStorageService,
    LocalStorageServiceImpl,
    MergeViewService,
    MergeViewServiceImpl,
    PromiseStorageService,
    PromiseStorageServiceImpl,
    SessionService,
    SessionServiceImpl,
    UserActionService,
    UserActionServiceImpl,
} from '@service';
import { ApplicationInfoScope, DialogScope, FilterScope, IntegrityScope, MergeViewScope, UserInfoScope } from '@scope';
import { Store } from 'redux';
import { RootState } from '@reducer';
import { store } from '@store';

const container = new Container({ autoBindInjectable: true });

container.bind<Store<RootState>>(TYPES.STORE).toConstantValue(store);
container.bind<ENDPOINT_TYPE>(TYPES.ENDPOINTS).toConstantValue(ENDPOINT);
container.bind<DialogScope>(TYPES.DIALOG_SCOPE).to(DialogScope).inSingletonScope();
container.bind<ApplicationInfoScope>(TYPES.APPLICATION_INFO_SCOPE).to(ApplicationInfoScope).inSingletonScope();
container.bind<IntegrityScope>(TYPES.INTEGRITY_SCOPE).to(IntegrityScope).inSingletonScope();
container.bind<FilterScope>(TYPES.FILTER_SCOPE).to(FilterScope).inSingletonScope();
container.bind<MergeViewScope>(TYPES.MERGE_VIEW_SCOPE).to(MergeViewScope).inSingletonScope();
container.bind<UserInfoScope>(TYPES.USER_INFO_SCOPE).to(UserInfoScope).inSingletonScope();

container.bind<DialogService>(TYPES.DIALOG_SERVICE).to(DialogServiceImpl).inSingletonScope();
container.bind<ApplicationInfoService>(TYPES.APPLICATION_INFO_SERVICE).to(ApplicationInfoServiceImpl).inSingletonScope();
container.bind<SessionService>(TYPES.SESSION_SERVICE).to(SessionServiceImpl).inSingletonScope();
container.bind<PromiseStorageService>(TYPES.PROMISE_STORAGE_SERVICE).to(PromiseStorageServiceImpl).inSingletonScope();
container.bind<LicenseService>(TYPES.LICENSE_SERVICE).to(LicenseServiceImpl).inSingletonScope();
container.bind<LanguageService>(TYPES.LANGUAGE_SERVICE).to(LanguageServiceImpl).inSingletonScope();
container.bind<LocalStorageService>(TYPES.LOCAL_STORAGE_SERVICE).to(LocalStorageServiceImpl).inSingletonScope();
container.bind<IntegrityService>(TYPES.INTEGRITY_SERVICE).to(IntegrityServiceImpl).inSingletonScope();
container.bind<UserActionService>(TYPES.USER_ACTION_SERVICE).to(UserActionServiceImpl).inSingletonScope();
container.bind<IntegrityLinkService>(TYPES.INTEGRITY_LINK_SERVICE).to(IntegrityLinkServiceImpl).inSingletonScope();
container.bind<ComparedFieldsService>(TYPES.COMPARED_FIELD_SERVICE).to(ComperedFieldsServiceImpl).inSingletonScope();
container.bind<FieldsDefinitionsService>(TYPES.FIELDS_DEFINITIONS_SERVICE).to(FieldsDefinitionsServiceImpl).inSingletonScope();
container.bind<IntegrityItemEditorService>(TYPES.INTEGRITY_ITEM_EDITOR_SERVICE).to(IntegrityItemEditorServiceImpl).inSingletonScope();
container.bind<FilterService>(TYPES.FILTER_SERVICE).to(FilterServiceImpl).inSingletonScope();
container.bind<MergeViewService>(TYPES.MERGE_VIEW_SERVICE).to(MergeViewServiceImpl).inSingletonScope();
container.bind<DocumentContentWriterService>(TYPES.DOCUMENT_CONTENT_WRITER_SERVICE).to(DocumentContentWriterServiceImpl).inSingletonScope();
container.bind<ExportService>(TYPES.EXPORT_SERVICE).to(ExportServiceImpl).inSingletonScope();

window['DIContainer'] = container;

// need to set default value for scope
Object.values(TYPES)
    .filter((identifier) => identifier.includes('Scope'))
    .forEach((identifier) => container.get(identifier));
