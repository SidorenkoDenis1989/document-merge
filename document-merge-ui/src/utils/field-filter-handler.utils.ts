import { FIELD_FILTER_OPERATORS, FieldFilter, IntegrityItem } from '@data';
import { isAfter, isBefore } from 'date-fns';

export class FieldFilterHandler {
    static [FIELD_FILTER_OPERATORS.EQUAL](filter: FieldFilter, item: IntegrityItem) {
        const value = item.fields[filter.fieldName];
        return value && value === filter.value;
    }

    static [FIELD_FILTER_OPERATORS.NOT_EQUAL](filter: FieldFilter, item: IntegrityItem) {
        const value = item.fields[filter.fieldName];
        return value !== filter.value;
    }

    static [FIELD_FILTER_OPERATORS.CONTAINS](filter: FieldFilter, item: IntegrityItem) {
        const value = FieldFilterHandler.getIntegrityItemValueInLowercase(filter, item);
        return value && value.includes(FieldFilterHandler.getFilterFieldValueInLowercase(filter));
    }

    static [FIELD_FILTER_OPERATORS.STARTS_WITH](filter: FieldFilter, item: IntegrityItem) {
        const value = FieldFilterHandler.getIntegrityItemValueInLowercase(filter, item);
        return value && value.startsWith(FieldFilterHandler.getFilterFieldValueInLowercase(filter));
    }

    static [FIELD_FILTER_OPERATORS.ENDS_WITH](filter: FieldFilter, item: IntegrityItem) {
        const value = FieldFilterHandler.getIntegrityItemValueInLowercase(filter, item);
        return value && value.endsWith(FieldFilterHandler.getFilterFieldValueInLowercase(filter));
    }

    static [FIELD_FILTER_OPERATORS.IS_EMPTY](filter: FieldFilter, item: IntegrityItem) {
        return !item.fields[filter.fieldName];
    }

    static [FIELD_FILTER_OPERATORS.IS_NOT_EMPTY](filter: FieldFilter, item: IntegrityItem) {
        return !!item.fields[filter.fieldName];
    }

    static [FIELD_FILTER_OPERATORS.BEFORE](filter: FieldFilter, item: IntegrityItem) {
        const value = item.fields[filter.fieldName];
        if (!value) {
            return false;
        }
        const valueDate = new Date(value);
        const filterDate = new Date(filter.value);
        return isBefore(valueDate, filterDate);
    }

    static [FIELD_FILTER_OPERATORS.AFTER](filter: FieldFilter, item: IntegrityItem) {
        const value = item.fields[filter.fieldName];
        if (!value) {
            return false;
        }
        const valueDate = new Date(value);
        const filterDate = new Date(filter.value);
        return isAfter(valueDate, filterDate);
    }

    private static getIntegrityItemValueInLowercase(filter: FieldFilter, item: IntegrityItem): string {
        return item.fields[filter.fieldName].toLowerCase();
    }

    private static getFilterFieldValueInLowercase(filter: FieldFilter): string {
        return filter.value.toLowerCase();
    }
}
