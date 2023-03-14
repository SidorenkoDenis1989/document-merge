import { inject, injectable } from 'inversify';
import { FieldDefinition, FieldFilter, IntegrityItem, IntegrityItemType, LOGIC_OPERATORS, TYPES } from '@data';
import { FilterScope } from '@scope';
import { IntegrityServiceImpl } from '@service/integrity.service';
import { FieldFilterHandler } from '@utils';

export interface FilterService {
    setFilterValues(itemTypes: IntegrityItemType[]): void;

    getFilteredItems(items: IntegrityItem[]): IntegrityItem[];

    addFieldFilter(filter: FieldFilter): void;

    removeFieldFilter(filter: FieldFilter): void;

    removeAllFieldFilters(): void;

    updateFieldFilter(filter: FieldFilter): void;

    updateFieldsFilters(fieldsFilters: FieldFilter[]): void;

    getFilledFieldFilters(): FieldFilter[];

    setFilledFieldFilters(filters: FieldFilter[]): void;

    setAvailableFields(documentFields: FieldDefinition[]): void;

    getSearchStr(): string;

    setSearchStr(search: string): void;

    setFilterDisabledState(isDisabled: boolean): void;
}

@injectable()
export class FilterServiceImpl implements FilterService {
    constructor(
        @inject(TYPES.FILTER_SCOPE) private filterScope: FilterScope,
        @inject(TYPES.INTEGRITY_SERVICE) private integrityService: IntegrityServiceImpl
    ) {}

    setFilterValues(itemTypes: IntegrityItemType[]) {
        this.filterScope.filterValues = itemTypes;
    }

    getFilteredItems(items: IntegrityItem[]): IntegrityItem[] {
        if (!items) {
            return [];
        }
        return this.filterByFields(this.filterBySearchStr(this.filterByType(items)));
    }

    addFieldFilter(filter: FieldFilter): void {
        this.filterScope.fieldsFilters = [...this.filterScope.fieldsFilters, filter];
    }

    removeFieldFilter(filter: FieldFilter): void {
        const newFilters = this.filterScope.fieldsFilters.filter((storeFilter) => storeFilter.id !== filter.id);
        if (newFilters.length) {
            newFilters[0] = { ...newFilters[0], logicOperator: LOGIC_OPERATORS.AND };
        }
        this.filterScope.fieldsFilters = newFilters;
    }

    removeAllFieldFilters(): void {
        this.filterScope.fieldsFilters = [];
    }

    updateFieldFilter(filter: FieldFilter): void {
        this.filterScope.fieldsFilters = this.filterScope.fieldsFilters.map((storeFilter) => (storeFilter.id === filter.id ? filter : storeFilter));
    }

    updateFieldsFilters(fieldsFilters: FieldFilter[]): void {
        this.filterScope.fieldsFilters = fieldsFilters;
    }

    getFilledFieldFilters(): FieldFilter[] {
        return this.filterScope.filledFieldsFilters;
    }

    setFilledFieldFilters(filters: FieldFilter[]): void {
        this.filterScope.filledFieldsFilters = filters;
    }

    setAvailableFields(documentFields: FieldDefinition[]): void {
        this.filterScope.availableFieldsByType = documentFields;
    }

    getSearchStr(): string {
        return this.filterScope.searchStr.trim();
    }

    setSearchStr(search: string): void {
        this.filterScope.searchStr = search;
    }

    setFilterDisabledState(isDisabled: boolean): void {
        this.filterScope.isDisabled = isDisabled;
    }

    private filterByType(items: IntegrityItem[]): IntegrityItem[] {
        return items.filter((item) => {
            if (this.isMovedAndModified(item.type)) {
                return true;
            }
            return this.filterScope.filterValues.includes(item.type);
        });
    }

    private filterBySearchStr(items: IntegrityItem[]): IntegrityItem[] {
        const searchStr = this.getSearchStr().toLowerCase();
        if (!searchStr) {
            return items;
        }
        return items.filter((item) => {
            return this.includeInBaseFields(item, searchStr) || this.includeInChangedFields(item, searchStr) || this.includeInAttachments(item, searchStr);
        });
    }

    private includeInBaseFields(item: IntegrityItem, searchStr: string): boolean {
        const values = [item.id, item.category, item.section, item.text];
        return values.some((value) => value.toLowerCase().includes(searchStr));
    }

    private includeInChangedFields(item: IntegrityItem, searchStr: string): boolean {
        const values = Object.values(item.changedFields);
        return values.some((changedField) => {
            return changedField.newValue.toLowerCase().includes(searchStr) || changedField.oldValue.toLowerCase().includes(searchStr);
        });
    }

    private includeInAttachments(item: IntegrityItem, searchStr: string): boolean {
        const values = Object.values(item.changedAttachments);
        return values.some((attachment) => {
            return (
                (attachment.primaryFileName && attachment.primaryFileName.toLowerCase().includes(searchStr)) ||
                (attachment.secondaryFileName && attachment.secondaryFileName.toLowerCase().includes(searchStr))
            );
        });
    }

    private filterByFields(items: IntegrityItem[]): IntegrityItem[] {
        if (!this.filterScope.filledFieldsFilters.length) {
            return items;
        }
        const notExistedFields = this.getNotExistedFields(items[0]);
        if (notExistedFields.length) {
            this.integrityService.fillItemsFields(notExistedFields);
            return items;
        }
        const filters = this.getANDFiltersByOR();
        return items.filter((item) => {
            return filters.some((andFilters) => andFilters.every((andFilter) => this.checkFieldFilter(andFilter, item)));
        });
    }

    private getNotExistedFields(item: IntegrityItem): string[] {
        const existedFields = Object.keys(item.fields || {});
        const notExistedFields = [];
        this.filterScope.filledFieldsFilters.forEach((filter) => {
            if (!existedFields.includes(filter.fieldName)) {
                notExistedFields.push(filter.fieldName);
            }
        });
        return notExistedFields;
    }

    private getANDFiltersByOR(): FieldFilter[][] {
        const filters = [];
        let andFilters = [];
        this.filterScope.filledFieldsFilters.forEach((filter) => {
            if (filter.logicOperator === LOGIC_OPERATORS.OR) {
                filters.push(andFilters);
                andFilters = [filter];
                return;
            }
            andFilters.push(filter);
        });
        filters.push(andFilters);
        return filters;
    }

    private checkFieldFilter(filter: FieldFilter, item: IntegrityItem): boolean {
        return FieldFilterHandler[filter.operator](filter, item);
    }

    private isMovedAndModified = (itemType: IntegrityItemType) => {
        const { filterValues } = this.filterScope;
        return (
            itemType === IntegrityItemType.MOVED_AND_MODIFY &&
            (filterValues.includes(IntegrityItemType.MOVED) || filterValues.includes(IntegrityItemType.MODIFY))
        );
    };
}
