import { ActionOptions, IntegrityItem, IntegrityItemType } from '@data';
import {
    deepCopy,
    filterItemsByCondition,
    FoundedPosition,
    getChildrenWithNewPositionAndOtherTypes,
    getChildrenWithOldPositionAndOtherTypes,
    getIntegrityItemWithNewPosition,
    getIntegrityItemWithOldPosition,
    getParentPosition,
    getPositionBySection,
    getSectionParts,
    isNewMovedItem,
    isOldMovedItem,
} from '@utils';

export const enum ACTION_TYPE {
    ACCEPT = 'ACCEPT',
    DECLINE = 'DECLINE',
    UPDATE = 'UPDATE',
}

export class ParentItemHandler {
    static readonly TOP_LEVEL = 1;
    static readonly INSERT_LOCATION_FIRST = 'first';
    static readonly FIRST_ITEM = '1';
    private readonly items: IntegrityItem[];
    private readonly documentId: string;
    private readonly result: ActionOptions[] = [];
    private readonly HANDLED_TYPES = [IntegrityItemType.MOVED, IntegrityItemType.MOVED_AND_MODIFY, IntegrityItemType.NEW];

    constructor(items: IntegrityItem[], documentId: string) {
        this.items = deepCopy(items);
        this.documentId = documentId;
    }

    static readonly LOCATION_TEMPLATE = (s: string) => `after:${s}`;

    public handleOptions(item: IntegrityItem, action: ACTION_TYPE): ActionOptions[] {
        this.handleItem(item, action);
        return this.result;
    }

    private handleItem(item: IntegrityItem, action: ACTION_TYPE) {
        let parentId = null;
        let insertLocation = null;
        const handler: Handler = ACTION_TYPE.DECLINE === action ? DeclineHandler[item.type]() : AcceptHandler[item.type]();

        if (this.HANDLED_TYPES.includes(item.type) && action === ACTION_TYPE.ACCEPT) {
            parentId = this.getParentId(item, handler);
            insertLocation = this.getInsertLocation(item);
        }
        handler.checkPermission(item, this.items);
        const preparedAction = handler.getAction(this.items, item, action);
        this.addItemToResult(item, preparedAction, insertLocation, parentId);
        const children = handler.getChildren(item, this.items);
        children.forEach((child) => this.handleItem(child, action));
    }

    private getParentId(item: IntegrityItem, handler: Handler) {
        const sectionParts = getSectionParts(item);
        if (sectionParts.length === ParentItemHandler.TOP_LEVEL) {
            return this.documentId;
        }

        const parentsPosition = getParentPosition(this.items, item);
        const parent = handler.chooseParent(parentsPosition);

        if (!parent) {
            throw Error('parent not found');
        }
        return parent.id;
    }

    private getInsertLocation(item: IntegrityItem): string {
        const sectionParts = getSectionParts(item);
        const lastSubSection = sectionParts[sectionParts.length - 1];
        if (lastSubSection === ParentItemHandler.FIRST_ITEM) {
            return ParentItemHandler.INSERT_LOCATION_FIRST;
        }

        const prevItemSectionParts = [...sectionParts];
        prevItemSectionParts[prevItemSectionParts.length - 1] = (Number.parseInt(lastSubSection, 10) - 1).toString();
        const prevItemSection = prevItemSectionParts.join('.');

        const prevItems = getPositionBySection(prevItemSection, this.items);
        if (prevItems.added) {
            return this.getInsertLocation(prevItems.added);
        }
        if (prevItems.newPosition && prevItems.newPosition.parentId !== item.parentId) {
            return this.getInsertLocation(prevItems.newPosition);
        }
        const prevItem = prevItems.newPosition || prevItems.noneChanged || prevItems.oldPosition || prevItems.deleted;
        if (!prevItem) {
            throw new Error(`Preview Item with section ${prevItemSection} not find`);
        }
        return ParentItemHandler.LOCATION_TEMPLATE(prevItem.id);
    }

    private addItemToResult(item: IntegrityItem, action: ACTION_TYPE, insertLocation: string, parentId: string) {
        const order = this.result.length + 1;
        this.result.push({
            action,
            item,
            insertLocation,
            parentInTheNewPosition: parentId,
            order,
        });
    }
}

const DeclineHandler = {
    [IntegrityItemType.MOVED]: () => new MovedDeclineHandler(),
    [IntegrityItemType.MOVED_AND_MODIFY]: () => new MovedDeclineHandler(),
    [IntegrityItemType.NEW]: () => new AddedDeclineHandler(),
};

const AcceptHandler = {
    [IntegrityItemType.NEW]: () => new AddedAcceptHandler(),
    [IntegrityItemType.MOVED]: () => new AcceptMoveHandler(),
    [IntegrityItemType.MOVED_AND_MODIFY]: () => new AcceptMoveHandler(),
    [IntegrityItemType.DELETE]: () => new AcceptDeleteHandler(),
};

interface Handler {
    getChildren(parent: IntegrityItem, items: IntegrityItem[]): IntegrityItem[];

    chooseParent(result: FoundedPosition): IntegrityItem;

    checkPermission(item: IntegrityItem, items: IntegrityItem[]): void;

    getAction(items: IntegrityItem[], item: IntegrityItem, action: ACTION_TYPE): ACTION_TYPE;
}

abstract class ActionHandler implements Handler {
    abstract chooseParent(result: FoundedPosition): IntegrityItem;

    abstract getChildren(parent: IntegrityItem, items: IntegrityItem[]): IntegrityItem[];

    checkPermission(item: IntegrityItem, items: IntegrityItem[]) {
        return;
    }

    getAction(items: IntegrityItem[], item: IntegrityItem, action: ACTION_TYPE): ACTION_TYPE {
        return action;
    }

    protected isClosestChild(parent: IntegrityItem, child: IntegrityItem): boolean {
        if (!child.section.startsWith(parent.section)) {
            return false;
        }
        const parentSectionLength = parent.section.split('.').length;
        const childSectionLength = child.section.split('.').length;
        return (childSectionLength - parentSectionLength) === 1;
    }
}

class AddedDeclineHandler extends ActionHandler {
    getChildren(parent: IntegrityItem, items: IntegrityItem[]): IntegrityItem[] {
        return filterItemsByCondition(
            items,
            (checkedItem) =>
                checkedItem.parentId === parent.id || (isNewMovedItem(checkedItem) && this.isClosestChild(parent, checkedItem)),
        ).map((child) => (isNewMovedItem(child) ? getIntegrityItemWithOldPosition(child.id, items) : child));
    }

    chooseParent(parentsPosition: FoundedPosition) {
        return parentsPosition.oldPosition;
    }
}

class MovedDeclineHandler extends ActionHandler {
    getChildren(parent: IntegrityItem, items: IntegrityItem[]): IntegrityItem[] {
        const parentInNewPosition = items.find(item => item.id === parent.id && isNewMovedItem(item));
        return filterItemsByCondition(
            items,
            (checkedItem) => this.isClosestChild(parentInNewPosition, checkedItem),
        ).map((child) => (isNewMovedItem(child) ? getIntegrityItemWithOldPosition(child.id, items) : child));
    }

    chooseParent(parentsPosition: FoundedPosition) {
        return parentsPosition.oldPosition || parentsPosition.noneChanged || parentsPosition.deleted;
    }

    getAction(items: IntegrityItem[], item: IntegrityItem, action: ACTION_TYPE): ACTION_TYPE {
        const itemInNewPosition = getIntegrityItemWithNewPosition(item.id, items);
        if (!this.isDeclineParent(items, itemInNewPosition)) {
            return action;
        }

        const newParent = items.find((parent) => parent.id === itemInNewPosition.parentId && isNewMovedItem(parent));

        if (!newParent) {
            return action;
        }

        const sectionChildLength = this.getSectionLength(newParent.section) + 1;
        const existedChildren = filterItemsByCondition(
            items,
            (checkedItem) => checkedItem.section.startsWith(newParent.section) && this.getSectionLength(checkedItem.section) === sectionChildLength,
        );
        item.section = newParent.section + '.' + (existedChildren.length + 1);
        item.secondarySection = item.section;
        return ACTION_TYPE.UPDATE;
    }

    private getSectionLength(section: string): number {
        return section.split('.').length;
    }

    private isDeclineParent(items: IntegrityItem[], item: IntegrityItem): boolean {
        const parents = getParentPosition(items, item);
        const parent = parents.added || parents.newPosition;
        return parent && parent.id !== item.parentId;
    }
}

class AddedAcceptHandler extends ActionHandler {
    getChildren(parent: IntegrityItem, items: IntegrityItem[]): IntegrityItem[] {
        return [];
    }

    chooseParent(parentsPosition: FoundedPosition) {
        return parentsPosition.added || parentsPosition.newPosition || parentsPosition.noneChanged;
    }
}

class AcceptMoveHandler extends ActionHandler {
    getChildren(parent: IntegrityItem, items: IntegrityItem[]): IntegrityItem[] {
        return getChildrenWithNewPositionAndOtherTypes(items, parent);
    }

    chooseParent(parentsPosition: FoundedPosition) {
        return parentsPosition.newPosition || parentsPosition.noneChanged || parentsPosition.added;
    }

    checkPermission(item: IntegrityItem, items: IntegrityItem[]) {
        const parentsPosition = getParentPosition(items, item);
        const parent = this.getNotResolvedParent(item, parentsPosition);
        if (parent) {
            throw new OrderDecisionException(parent);
        }
    }

    private getNotResolvedParent(item: IntegrityItem, parentsPosition: FoundedPosition): IntegrityItem {
        if (parentsPosition.added) {
            return parentsPosition.added;
        }
        if (parentsPosition.newPosition && item.parentId !== parentsPosition.newPosition.id) {
            return parentsPosition.newPosition;
        }
    }
}

class AcceptDeleteHandler extends ActionHandler {
    getChildren(parent: IntegrityItem, items: IntegrityItem[]): IntegrityItem[] {
        return getChildrenWithOldPositionAndOtherTypes(items, parent).map((child) =>
            isOldMovedItem(child) ? getIntegrityItemWithNewPosition(child.id, items) : child,
        );
    }

    chooseParent(parentsPosition: FoundedPosition) {
        return parentsPosition.newPosition || parentsPosition.noneChanged || parentsPosition.added;
    }
}

export class OrderDecisionException extends Error {
    private readonly item: IntegrityItem;

    constructor(item: IntegrityItem) {
        super();
        this.item = item;
    }

    getItem(): IntegrityItem {
        return this.item;
    }
}
