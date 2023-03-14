import { injectable } from 'inversify';
import { DifferenceOptions, IntegrityItem, MergeDocument, TYPES } from '@data';
import { scopeDecorator } from '@utils';

@scopeDecorator(TYPES.INTEGRITY_SCOPE)
@injectable()
export class IntegrityScope {
    activeDocument: MergeDocument = null;
    integrityItems: IntegrityItem[] = null;
    differenceOptions: DifferenceOptions = null;
}
