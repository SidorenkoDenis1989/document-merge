import { IntegrityItemType, MOVED_POSITION } from '@data';

type integrityItemTypeSortOrder = {
    [key in IntegrityItemType]: number;
};
export const INTEGRITY_ITEM_TYPE_SORT_ORDER: integrityItemTypeSortOrder = {
    [IntegrityItemType.NEW]: 1,
    [IntegrityItemType.DELETE]: 2,
    [IntegrityItemType.MOVED]: 3,
    [IntegrityItemType.MOVED_AND_MODIFY]: 3,
    [IntegrityItemType.MODIFY]: 4,
    [IntegrityItemType.NONE]: 4,
};

type movedPositionPriority = {
    [key in MOVED_POSITION]: number;
};

export const MOVED_POSITION_PRIORITY: movedPositionPriority = {
    [MOVED_POSITION.NEW]: 1,
    [MOVED_POSITION.OLD]: 0,
};

export const INTEGRITY_ITEM_MOVED_TYPES = [IntegrityItemType.MOVED, IntegrityItemType.MOVED_AND_MODIFY];
export const INTEGRITY_ITEM_MODIFY_TYPES = [IntegrityItemType.MODIFY, IntegrityItemType.MOVED_AND_MODIFY];
