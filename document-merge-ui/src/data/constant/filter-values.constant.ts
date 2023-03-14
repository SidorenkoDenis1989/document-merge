import { IntegrityItemType } from '@data/entity/integrity-item.entity';

export const INITIAL_CHANGES_FILTER_VALUES = [
    IntegrityItemType.NONE,
    IntegrityItemType.NEW,
    IntegrityItemType.MOVED,
    IntegrityItemType.MODIFY,
    IntegrityItemType.DELETE,
];
