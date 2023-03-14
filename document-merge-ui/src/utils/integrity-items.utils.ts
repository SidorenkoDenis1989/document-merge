import { INTEGRITY_ITEM_MOVED_TYPES, IntegrityItem, IntegrityItemType, MOVED_POSITION } from '@data';
import { getId } from './integrity-mapping.utils';

type conditionFunc = (checkedItem: IntegrityItem) => boolean
export const filterItemsByCondition = (items: IntegrityItem[], func: conditionFunc) => {
    return items.filter((item) => func(item));
};

export const getChildrenWithNewPositionAndOtherTypes = (items: IntegrityItem[], parentItem: IntegrityItem) => {
    return filterItemsByCondition(items, (checkedItem) => checkedItem.parentId === parentItem.id
        && (checkedItem.movedPosition === MOVED_POSITION.NEW || !INTEGRITY_ITEM_MOVED_TYPES.includes(checkedItem.type)));
};

export const getChildrenWithOldPositionAndOtherTypes = (items: IntegrityItem[], parentItem: IntegrityItem) => {
    return filterItemsByCondition(items, (checkedItem) => checkedItem.parentId === parentItem.id
        && (checkedItem.movedPosition === MOVED_POSITION.OLD || !INTEGRITY_ITEM_MOVED_TYPES.includes(checkedItem.type)));
};

export type FoundedPosition = Partial<{
    noneChanged: IntegrityItem;
    added: IntegrityItem;
    newPosition: IntegrityItem
    oldPosition: IntegrityItem
    deleted: IntegrityItem
}>;

export const getParentPosition = (items: IntegrityItem[], child: IntegrityItem): FoundedPosition => {
    const result: FoundedPosition = {};

    const parentSectionParts = getSectionParts(child);
    parentSectionParts.pop();
    const parentSection = parentSectionParts.join('.');

    items.forEach(item => {
        if (item.section !== parentSection) {
            return;
        }
        fillFoundedPosition(result, item);
    });
    return result;
};

export const getPositionBySection = (section: string, items: IntegrityItem[]): FoundedPosition => {
        const result: FoundedPosition = {};

        items.forEach(item => {
            if (item.section !== section) {
                return;
            }
            fillFoundedPosition(result, item);
        });
        return result;
};

const fillFoundedPosition = (result: FoundedPosition, item: IntegrityItem) => {
    switch (item.type) {
        case IntegrityItemType.NONE:
        case IntegrityItemType.MODIFY:
            return result.noneChanged = item;
        case IntegrityItemType.DELETE:
            return result.deleted = item;
        case IntegrityItemType.NEW:
            return result.added = item;
        case IntegrityItemType.MOVED:
        case IntegrityItemType.MOVED_AND_MODIFY:
            if (item.movedPosition === MOVED_POSITION.OLD) {
                return result.oldPosition = item;
            }
            result.newPosition = item;
    }
};

export const getSectionParts = (item: IntegrityItem): string[] => item.section.split('.');

export const getIntegrityItemWithNewPosition = (itemId: string, integrityItems: IntegrityItem[]): IntegrityItem =>  {
    return integrityItems.find((storeItem) => getId(storeItem) === (itemId + MOVED_POSITION.NEW));
};


export const getIntegrityItemWithOldPosition = (itemId: string, integrityItems: IntegrityItem[]): IntegrityItem => {
    return integrityItems.find((storeItem) => getId(storeItem) === (itemId + MOVED_POSITION.OLD))
};
