import { inject, injectable } from 'inversify';
import { ActionOptions, IntegrityItem, IntegrityItemType, MOVED_POSITION, TYPES } from '@data';
import { IntegrityScope } from '@scope';
import { getId, MultipleActionHandlerUtil, SectionCalculator } from '@utils';
import type { IntegrityService, ComparedFieldsService } from '@service';

export interface IntegrityItemEditorService {
    save(item: IntegrityItem): void;

    saveWithChangedFields(item: IntegrityItem, changedFields: string[], newType: IntegrityItemType): Promise<IntegrityItem>;

    delete(item: IntegrityItem): void;

    deleteAndRecalculate(item: IntegrityItem): void;

    move(item: IntegrityItem): void;

    unMove(item: IntegrityItem): void;

    changeToMoveType(item: IntegrityItem): void;

    applyMultipleActions(options: ActionOptions[])
}

@injectable()
export class IntegrityItemEditorServiceImpl implements IntegrityItemEditorService {
    constructor(
        @inject(TYPES.INTEGRITY_SCOPE) private integrityScope: IntegrityScope,
        @inject(TYPES.INTEGRITY_SERVICE) private integrityService: IntegrityService,
        @inject(TYPES.COMPARED_FIELD_SERVICE) private fieldsService: ComparedFieldsService,
    ) {
    }

    save(item: IntegrityItem): void {
        const { items, changedItem } = this.getNewItemsAndChangedItem(item);
        changedItem.type = IntegrityItemType.NONE;
        this.integrityScope.integrityItems = SectionCalculator.recalculate(items);
    }

    async saveWithChangedFields(item: IntegrityItem, changedFields: string[], newType: IntegrityItemType): Promise<IntegrityItem> {
        const { items, changedItem } = this.getNewItemsAndChangedItem(item);
        changedItem.type = newType;
        const { type, nodeType } = this.integrityScope.activeDocument;
        const documentFields = await this.fieldsService.getFields(type, nodeType);
        const allChangedFields = Object.keys(item.changedFields);
        if (this.isSetOldValue(allChangedFields, documentFields.textFieldName, changedFields)) {
            changedItem.text = item.changedFields[documentFields.textFieldName].oldValue;
        }
        if (this.isSetOldValue(allChangedFields, documentFields.categoryFieldName, changedFields)) {
            changedItem.category = item.changedFields[documentFields.categoryFieldName].oldValue;
        }
        this.integrityScope.integrityItems = SectionCalculator.recalculate(items);
        return Promise.resolve(changedItem);
    }

    changeToMoveType(item: IntegrityItem): void {
        const { items, changedItem } = this.getNewItemsAndChangedItem(item);
        changedItem.type = IntegrityItemType.MOVED;
        this.integrityScope.integrityItems = items;
    }

    delete(item: IntegrityItem): void {
        this.integrityScope.integrityItems = this.integrityScope.integrityItems.filter((storeItem) => storeItem.id !== item.id);
    }

    deleteAndRecalculate(item: IntegrityItem): void {
        const items = [...this.integrityScope.integrityItems].filter((storeItem) => storeItem.id !== item.id);
        this.integrityScope.integrityItems = SectionCalculator.recalculate(items);
    }

    move(item: IntegrityItem): void {
        const items = [...this.integrityScope.integrityItems].filter(
            (storeItem) => storeItem.id !== item.id || (storeItem.id === item.id && storeItem.movedPosition === MOVED_POSITION.NEW),
        );
        item.primarySection = item.secondarySection;
        this.setItem(item, items);
    }

    unMove(item: IntegrityItem): void {
        const items = [...this.integrityScope.integrityItems].filter(
            (storeItem) => storeItem.id !== item.id || (storeItem.id === item.id && storeItem.movedPosition === MOVED_POSITION.OLD),
        );
        this.setItem(item, items);
    }

    applyMultipleActions(options: ActionOptions[]) {
        const handledItems = new MultipleActionHandlerUtil(this.integrityScope.integrityItems)
            .handle(options);
        this.integrityScope.integrityItems = SectionCalculator.recalculate(handledItems);
    }

    private isSetOldValue(allChangedFields: string[], fieldKey: string, changedFields: string[]): boolean {
        return this.isExist(allChangedFields, fieldKey) && !this.isExist(changedFields, fieldKey);
    }

    private isExist(fields: string[], fieldKey: string): boolean {
        return fields.some((key) => key === fieldKey);
    }

    private getNewItemsAndChangedItem(item: IntegrityItem): { items: IntegrityItem[]; changedItem: IntegrityItem } {
        let changedItem: IntegrityItem = null;
        const items = this.integrityScope.integrityItems.map((storeItem) => {
            if (getId(storeItem) !== getId(item)) {
                return storeItem;
            }
            changedItem = { ...storeItem };
            return changedItem;
        });
        return { items, changedItem };
    }

    private setItem(item: IntegrityItem, items: IntegrityItem[]) {
        this.setNoneType(item, items);
        this.integrityScope.integrityItems = SectionCalculator.recalculate(items);
    }

    private setNoneType(item: IntegrityItem, items: IntegrityItem[]) {
        const editableItem = items.find((storeItem) => storeItem.id === item.id);
        editableItem.type = IntegrityItemType.NONE;
    }
}
