import { injectable } from 'inversify';
import { Dialog, TYPES } from '@data';
import { scopeDecorator } from '@utils';

@scopeDecorator(TYPES.DIALOG_SCOPE)
@injectable()
export class DialogScope {
    dialogs: Dialog[] = [];
}
