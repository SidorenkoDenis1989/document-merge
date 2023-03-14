import { scopeDecorator } from '@utils';
import { FieldDefinition, FieldFilter, INITIAL_CHANGES_FILTER_VALUES, IntegrityItemType, TYPES } from '@data';
import { injectable } from 'inversify';

@scopeDecorator(TYPES.FILTER_SCOPE)
@injectable()
export class FilterScope {
    filterValues: IntegrityItemType[] = INITIAL_CHANGES_FILTER_VALUES;
    fieldsFilters: FieldFilter[] = [];
    filledFieldsFilters: FieldFilter[] = [];
    availableFieldsByType: FieldDefinition[] = [];
    searchStr = '';
    isDisabled = true;
}
