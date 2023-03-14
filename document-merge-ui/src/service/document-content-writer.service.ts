import { inject, injectable } from 'inversify';
import {
    ActionOptions,
    AttachmentDetailsDto,
    CopyContentWriterParams,
    EditContent,
    IntegrityItem,
    IntegrityItemType,
    MoveContentWriterParams,
    TYPES,
} from '@data';
import { IntegrityScope, MergeViewScope } from '@scope';
import { getActiveHostId, showOrderDecisionErrorMessage } from '@utils';
import { ACTION_TYPE, OrderDecisionException, ParentItemHandler } from '@service/parent-item-handler';
import type { IntegrityService, IntegrityItemEditorService, UserActionService } from '@service';
import type { ENDPOINT_TYPE } from '@data';

export interface DocumentContentWriterService {
    copyIntegrityItem(item: IntegrityItem): Promise<IntegrityItem>;

    deleteIntegrityItem(item: IntegrityItem): Promise<void>;

    declineAddedIntegrityItem(item: IntegrityItem): Promise<void>

    moveIntegrityItem(item: IntegrityItem): Promise<void>;

    moveAndModifyIntegrityItem(item: IntegrityItem, modifyFunc: () => Promise<string>): Promise<void>;

    declineMoveIntegrityItem(item: IntegrityItem): Promise<void>

    editIntegrityItem(item: IntegrityItem, fields: { [key: string]: string }, attachments: AttachmentDetailsDto[]): Promise<string>;
}

@injectable()
export class DocumentContentWriterServiceImpl implements DocumentContentWriterService {

    constructor(
        @inject(TYPES.INTEGRITY_SCOPE) private integrityScope: IntegrityScope,
        @inject(TYPES.MERGE_VIEW_SCOPE) private mergeViewScope: MergeViewScope,
        @inject(TYPES.ENDPOINTS) private ENDPOINTS: ENDPOINT_TYPE,
        @inject(TYPES.INTEGRITY_SERVICE) private integrityService: IntegrityService,
        @inject(TYPES.INTEGRITY_ITEM_EDITOR_SERVICE) private editorService: IntegrityItemEditorService,
        @inject(TYPES.USER_ACTION_SERVICE) private userActionService: UserActionService,
    ) {
    }

    copyIntegrityItem(item: IntegrityItem): Promise<IntegrityItem> {
        const options = this.handleOptions(item, ACTION_TYPE.ACCEPT);
        const copyContentOptions: CopyContentWriterParams = {
            copyContentId: item.id,
            parentID: options[0].parentInTheNewPosition,
            insertLocation: options[0].insertLocation,
            noBranch: !this.mergeViewScope.isBranchDifference,
            asOf: this.mergeViewScope.currentSecondaryBaseline?.asOf,
        };
        return this.ENDPOINTS.INTEGRITY.COPY_INTEGRITY_ITEM(copyContentOptions, getActiveHostId()).then((newId) => {
            return this.updateId(item, newId);
        });
    }

    deleteIntegrityItem(item: IntegrityItem): Promise<void> {
        const options = this.handleOptions(item, ACTION_TYPE.ACCEPT);
        if (options.length === 1) {
            return this.ENDPOINTS.INTEGRITY.DELETE_INTEGRITY_ITEM(getActiveHostId(), item.id).then(() => {
                this.editorService.delete(item);
                return this.userActionService.accept(item);
            });
        }
        return this.ENDPOINTS.INTEGRITY.ACTION_WITH_SUBSECTIONS({
            differenceOptions: this.integrityScope.differenceOptions,
            items: options,
        }).then(() => this.editorService.applyMultipleActions(options));
    }

    declineAddedIntegrityItem(item: IntegrityItem): Promise<void> {
        const options = this.handleOptions(item, ACTION_TYPE.DECLINE);
        if (options.length === 1) {
            this.editorService.deleteAndRecalculate(item);
            return this.userActionService.decline(item);
        }
        return this.ENDPOINTS.INTEGRITY.ACTION_WITH_SUBSECTIONS({
            differenceOptions: this.integrityScope.differenceOptions,
            items: options,
        }).then(() => this.editorService.applyMultipleActions(options));
    }

    moveIntegrityItem(item: IntegrityItem): Promise<void> {
        const options = this.handleOptions(item, ACTION_TYPE.ACCEPT);
        if (options.length === 1) {
            return this.ENDPOINTS.INTEGRITY.MOVE_INTEGRITY_ITEM(this.toMoveContentWriterParams(options[0]), getActiveHostId())
                .then(() => {
                    this.editorService.move(item);
                    return this.userActionService.accept(item);
                });
        }
        return this.ENDPOINTS.INTEGRITY.ACTION_WITH_SUBSECTIONS({
            differenceOptions: this.integrityScope.differenceOptions,
            items: options,
        }).then(() => this.editorService.applyMultipleActions(options));
    }

    async moveAndModifyIntegrityItem(item: IntegrityItem, modifyFunc: () => Promise<string>): Promise<void> {
        const options = this.handleOptions(item, ACTION_TYPE.ACCEPT);
        if (options.length === 1) {
            await modifyFunc();
            return this.ENDPOINTS.INTEGRITY.MOVE_INTEGRITY_ITEM(this.toMoveContentWriterParams(options[0]), getActiveHostId())
                .then(() => {
                    this.editorService.move(item);
                    return this.userActionService.accept(item);
                });
        }
        return this.ENDPOINTS.INTEGRITY.ACTION_WITH_SUBSECTIONS({
            differenceOptions: this.integrityScope.differenceOptions,
            items: options,
        }).then(() => this.editorService.applyMultipleActions(options));
    }



    declineMoveIntegrityItem(item: IntegrityItem): Promise<void> {
        const options = this.handleOptions(item, ACTION_TYPE.DECLINE);
        if (options.length === 1) {
            return this.handleDeclineSimpleMovedItem(item);
        }
        return this.ENDPOINTS.INTEGRITY.ACTION_WITH_SUBSECTIONS({
            differenceOptions: this.integrityScope.differenceOptions,
            items: options,
        }).then(() => this.editorService.applyMultipleActions(options));
    }

    private handleDeclineSimpleMovedItem(item: IntegrityItem) {
        this.editorService.unMove(item);
        if (item.type === IntegrityItemType.MOVED_AND_MODIFY) {
            this.editorService.saveWithChangedFields(item, [], IntegrityItemType.NONE);
        }
        return this.userActionService.decline(item);
    }

    editIntegrityItem(item: IntegrityItem, fields: { [p: string]: string }, attachments: AttachmentDetailsDto[]): Promise<string> {
        const params: EditContent = {
            contentId: item.id,
            sourceItemId: item.secondaryId,
            fieldNameAndValue: fields,
            attachments: attachments,
        };
        return this.ENDPOINTS.INTEGRITY.EDIT_INTEGRITY_ITEM(params, getActiveHostId());
    }


    private toMoveContentWriterParams(option: ActionOptions): MoveContentWriterParams {
        return {
            insertLocation: option.insertLocation,
            parentInTheNewPosition: option.parentInTheNewPosition,
            movedItem: option.item.id,
        };
    }

    private updateId(item: IntegrityItem, newId: string): IntegrityItem {
        const updateItem = { ...item, id: newId, oldId: item.id };
        const items = this.integrityScope.integrityItems.map((storeItem) => {
            if (storeItem === item) {
                return updateItem;
            }
            return storeItem;
        });
        this.integrityScope.integrityItems = items;
        return updateItem;
    }

    private handleOptions(item: IntegrityItem, action: ACTION_TYPE): ActionOptions[] {
        try {
            return new ParentItemHandler(this.integrityScope.integrityItems, this.integrityScope.activeDocument.id)
                .handleOptions(item, action);
        } catch (error) {
            if (error instanceof OrderDecisionException) {
                showOrderDecisionErrorMessage(error.getItem())
            }
            throw new Error(error);
        }
    }
}

