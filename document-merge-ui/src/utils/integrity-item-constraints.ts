import { IntegrityItem, IntegrityItemType, MOVED_POSITION, TYPES } from '@data';
import { IntegrityService } from '@service';
import { filterItemsByCondition, getSectionParts } from '@utils';

export const getConstraintParents = (item: IntegrityItem): IntegrityItem[] => {
    const integrityService = DIContainer.get<IntegrityService>(TYPES.INTEGRITY_SERVICE);
    const parentSection = getSectionParts(item).slice(0, -1).join('.');
    return filterItemsByCondition(integrityService.getIntegrityItemsFromStore(),
        checkedItem => (checkedItem.id === item.parentId
            && DEPENDENCY_TYPES_FOR_CHILDREN.includes(checkedItem.type))
            || (checkedItem.section === parentSection
                && (checkedItem.type === IntegrityItemType.NEW
                    || checkedItem.movedPosition === MOVED_POSITION.NEW)
            ),
    );
};

const DEPENDENCY_TYPES_FOR_CHILDREN: IntegrityItemType[] = [
    IntegrityItemType.MOVED,
    IntegrityItemType.MOVED_AND_MODIFY,
    IntegrityItemType.DELETE,
    IntegrityItemType.NEW,
];
