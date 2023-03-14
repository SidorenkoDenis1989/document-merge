import { inject, injectable } from 'inversify';
import { Baseline, DifferenceOptions, IntegrityItem, MOVED_POSITION, TYPES } from '@data';
import { IntegrityScope, MergeViewScope } from '@scope';
import { getActiveHostId, getId, SectionCalculator, SectionSorter } from '@utils';
import type { ENDPOINT_TYPE } from '@data';

export interface IntegrityService {
    getIntegrityItems(options: DifferenceOptions, secondaryBaseline: Baseline): Promise<IntegrityItem[]>;

    mergeAll(options: DifferenceOptions, secondaryBaseline: Baseline): Promise<IntegrityItem[]>;

    cleanIntegrityItems();

    getIntegrityItemById(itemId: string): IntegrityItem;

    getIntegrityItemsById(itemId: string): IntegrityItem[];

    getIntegrityItemsFromStore(): IntegrityItem[];

    getIntegrityItemWithOldPosition(itemId: string): IntegrityItem

    getIntegrityItemWithNewPosition(itemId: string): IntegrityItem

    fillItemsFields(fields: string[]): Promise<IntegrityItem[]>;

    getPickListValues(fieldName: string): Promise<string[]>;
}

@injectable()
export class IntegrityServiceImpl implements IntegrityService {
    constructor(
        @inject(TYPES.INTEGRITY_SCOPE) private integrityScope: IntegrityScope,
        @inject(TYPES.MERGE_VIEW_SCOPE) private mergeViewScope: MergeViewScope,
        @inject(TYPES.ENDPOINTS) private ENDPOINTS: ENDPOINT_TYPE
    ) {}

    getIntegrityItems(options: DifferenceOptions, secondaryBaseline: Baseline): Promise<IntegrityItem[]> {
        const isHideMergeHistory = this.mergeViewScope.isHideMergeHistory;
        return this.ENDPOINTS.INTEGRITY.GET_INTEGRITY_ITEMS(options, isHideMergeHistory).then((items) => {
            const sortedItems = SectionSorter.sort(items);
            const integrityItems = SectionCalculator.recalculate(sortedItems);
            this.integrityScope.integrityItems = integrityItems;
            this.integrityScope.differenceOptions = options;
            this.integrityScope.activeDocument = options.primary;
            this.mergeViewScope.currentSecondaryBaseline = secondaryBaseline;
            this.mergeViewScope.isReadOnly = !!options.labelPrimary || !!options.datePrimary;
            this.mergeViewScope.isBranchDifference = options.primary.id !== options.secondary.id;
            return integrityItems;
        });
    }

    mergeAll(options: DifferenceOptions, secondaryBaseline: Baseline): Promise<IntegrityItem[]> {
        const isHideMergeHistory = this.mergeViewScope.isHideMergeHistory;
        return this.ENDPOINTS.INTEGRITY.ACCEPT_ALL(options, isHideMergeHistory);
    }

    cleanIntegrityItems() {
        this.integrityScope.integrityItems = null;
    }

    getIntegrityItemById(itemId: string): IntegrityItem {
        return this.integrityScope.integrityItems.find((storeItem) => getId(storeItem) === itemId);
    }

    getIntegrityItemsById(itemId: string): IntegrityItem[] {
        return this.integrityScope.integrityItems
            .filter((storeItem) => storeItem.id === itemId);
    }
    getIntegrityItemsFromStore(): IntegrityItem[] {
        return this.integrityScope.integrityItems;
    }

    getIntegrityItemWithOldPosition(itemId: string): IntegrityItem {
        return this.integrityScope.integrityItems.find((storeItem) => getId(storeItem) === (itemId + MOVED_POSITION.OLD));
    }

    getIntegrityItemWithNewPosition(itemId: string): IntegrityItem {
        return this.integrityScope.integrityItems.find((storeItem) => getId(storeItem) === (itemId + MOVED_POSITION.NEW));
    }

    fillItemsFields(fields: string[]): Promise<IntegrityItem[]> {
        const ids = this.integrityScope.integrityItems.map((item) => item.id);

        return this.ENDPOINTS.INTEGRITY.GET_FIELDS_BY_IDS(ids, fields, getActiveHostId()).then((data) => {
            const items = this.integrityScope.integrityItems.map((item) => {
                const oldFields = item.fields || {};
                const newFields = data[item.id] || {};
                item.fields = { ...oldFields, ...newFields };
                return item;
            });
            this.integrityScope.integrityItems = items;
            return items;
        });
    }

    getPickListValues(fieldName: string): Promise<string[]> {
        return this.ENDPOINTS.INTEGRITY.GET_PICK_LIST_VALUES(getActiveHostId(), fieldName);
    }
}
