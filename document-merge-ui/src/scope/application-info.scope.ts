import {injectable} from 'inversify';
import {Documentation, ILMConfiguration, MergeDocument, TYPES} from '@data';
import {scopeDecorator} from '@utils';
import {AvailableThemes} from '@theme';

@scopeDecorator(TYPES.APPLICATION_INFO_SCOPE)
@injectable()
export class ApplicationInfoScope {
    hosts: ILMConfiguration[] = null;
    availableLanguages: object = null;
    isVisibleNavBar = false;
    appTheme: AvailableThemes = null;
    documents: MergeDocument[] = null;
    documentation: Documentation = { visible: false, url: null };
    dateFormat: string = null;
    readOnlyFields: string[] = [];
}
