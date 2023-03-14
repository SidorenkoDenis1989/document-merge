import { ActionOptions, IntegrityItem, IntegrityItemType, MOVED_POSITION } from '@data';
import { deepCopy } from '@utils';
import { ACTION_TYPE } from '@service/parent-item-handler';

export class MultipleActionHandlerUtil {

    private items: IntegrityItem[];

    constructor(items: IntegrityItem[]) {
        this.items = deepCopy(items);
    }

    handle(options: ActionOptions[]): IntegrityItem[] {
        options.forEach(option => {
            switch (option.item.type) {
                case IntegrityItemType.NEW:
                    return this.handleAdd(option);
                case IntegrityItemType.MOVED:
                case IntegrityItemType.MOVED_AND_MODIFY:
                    return this.handleMove(option);
                case IntegrityItemType.DELETE:
                   this.handleDelete(option)
            }
        });
        return this.items;
    }

    private handleAdd(option: ActionOptions) {
        return this.deleteByCondition(checkedItem => checkedItem.id === option.item.id);
    }

    private handleMove(option: ActionOptions) {
        if (option.action === ACTION_TYPE.UPDATE) {
            return this.updateSection(option.item);
        }

        if (option.action === ACTION_TYPE.DECLINE) {
            this.deleteByCondition(checked => checked.id === option.item.id
                && checked.movedPosition === MOVED_POSITION.NEW);
        }
        if (option.action === ACTION_TYPE.ACCEPT) {
            this.deleteByCondition(checked => checked.id === option.item.id
                && checked.movedPosition === MOVED_POSITION.OLD);
        }
        const item = this.items.find(checkedItem => checkedItem.id === option.item.id);
        if (option.action === ACTION_TYPE.ACCEPT) {
            item.primarySection = item.secondarySection;
        }
        item.movedPosition = null;
        item.type = option.item.type === IntegrityItemType.MOVED_AND_MODIFY ? IntegrityItemType.MODIFY : IntegrityItemType.NONE;
    }

    private deleteByCondition(conditionFunc: (checked: IntegrityItem) => boolean ) {
        this.items = this.items.filter(checkedItem => !conditionFunc(checkedItem));
    }

    private updateSection(item: IntegrityItem) {
        let oldPosition: IntegrityItem = null;
        let newPosition: IntegrityItem = null;
        this.items.forEach(checkedItem => {
            if (checkedItem.id !== item.id) {
                return;
            }
            if (checkedItem.movedPosition === MOVED_POSITION.OLD) {
                oldPosition = checkedItem;
            } else {
                newPosition = checkedItem;
            }
        });
        oldPosition.secondarySection = item.section;
        newPosition.secondarySection = item.section;
        newPosition.section = item.section;
    }

    private handleDelete(option: ActionOptions) {
        if (option.action === ACTION_TYPE.ACCEPT) {
            return this.deleteByCondition(checked => checked.id === option.item.id);
        }
        const deletedItem = this.items.find(checkedItem => checkedItem.id === option.item.id);
        deletedItem.type = IntegrityItemType.NONE;
    }
}
