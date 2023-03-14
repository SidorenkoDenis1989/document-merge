import React from 'react';
import { Box, Button, Grid, Paper, Theme, useTheme } from '@mui/material';
import { ConfirmationDialog, NDMIntegrityItemAction, NDMIntegrityItemHead, NDMItegrityItemTable, NDMLoaderPage } from '@component';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import { makeStyles } from '@mui/styles';
import { COLORS } from '@theme';
import {
    AttachmentDetailsDto,
    INTEGRITY_ITEM_MODIFY_TYPES,
    IntegrityItem,
    IntegrityItemType,
    MergeDocument,
    MOVED_POSITION,
    TYPES,
} from '@data';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTranslation } from 'react-i18next';
import {
    ComparedFieldsService,
    DialogService,
    DocumentContentWriterService,
    IntegrityItemEditorService,
    IntegrityLinkService,
    IntegrityService,
    MergeViewService,
} from '@service';
import { getConstraintParents, getId, openInNewTab, useWrapperLoading } from '@utils';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer';
import { UserActionServiceImpl } from '@service/user-action.service';

export const chooseColor = (type: IntegrityItemType): string => {
    switch (type) {
        case IntegrityItemType.NEW:
            return COLORS.greenOpacity;
        case IntegrityItemType.DELETE:
            return COLORS.redOpacity;
        case IntegrityItemType.MODIFY:
            return COLORS.brownOpacity;
        case IntegrityItemType.MOVED:
            return COLORS.blueOpacity;
        case IntegrityItemType.MOVED_AND_MODIFY:
            return COLORS.blueOpacity;
        default:
            return '';
    }
};

const useStyles = makeStyles<Theme>((theme) => ({
    container: {
        backgroundColor: theme.nanga.boxBackground,
        padding: '16px',
        paddingRight: '40px',
        position: 'relative',
        marginBottom: '20px',
    },
    buttons: {
        marginTop: '20px',
    },
    buttonsControl: {
        '& > button': {
            marginLeft: '20px',
        },
    },
    box: {
        position: 'absolute',
        right: 0,
        top: 0,
        height: '100%',
        width: '25px',
        background: (item: IntegrityItem) => chooseColor(item.type),
    },
}));

export interface NDMIntegrityItemProps {
    item: IntegrityItem;
    isFocused: boolean;
    ref?: React.Ref<HTMLDivElement>;
}

const LOADING_INTEGRITY_CHANGES = 'integrityChanges';
const DEFAULT_FOCUSED_ITEM_EVALUATION = 24;
const DEFAULT_ITEM_EVALUATION = 0;
export const NDMIntegrityItem: React.FC<NDMIntegrityItemProps> = React.forwardRef<HTMLDivElement, NDMIntegrityItemProps>(({ item, isFocused }, ref) => {
    const contentWriterService = DIContainer.get<DocumentContentWriterService>(TYPES.DOCUMENT_CONTENT_WRITER_SERVICE);
    const integrityLinkService = DIContainer.get<IntegrityLinkService>(TYPES.INTEGRITY_LINK_SERVICE);
    const editorService = DIContainer.get<IntegrityItemEditorService>(TYPES.INTEGRITY_ITEM_EDITOR_SERVICE);
    const mergeViewService = DIContainer.get<MergeViewService>(TYPES.MERGE_VIEW_SERVICE);
    const dialogService = DIContainer.get<DialogService>(TYPES.DIALOG_SERVICE);
    const integrityService = DIContainer.get<IntegrityService>(TYPES.INTEGRITY_SERVICE);
    const userActionService = DIContainer.get<UserActionServiceImpl>(TYPES.USER_ACTION_SERVICE);
    const comparedFieldsService = DIContainer.get<ComparedFieldsService>(TYPES.COMPARED_FIELD_SERVICE);

    const { id, section, category, text, type, changedFields, movedPosition, changedAttachments } = item;

    const [itemOpen, isItemOpen] = React.useState<boolean>(false);
    const [selectedFields, setSelectedFields] = React.useState<string[]>([]);
    const [textFieldName, setTextFieldName] = React.useState<string>('');

    const theme = useTheme();

    const isOpenedFrom = useSelector<RootState, boolean>((state) => state.MergeViewScope.isOpenMergeConditions);

    const readOnlyFields = useSelector<RootState, string[]>((state) => state.ApplicationInfoScope.readOnlyFields);

    const activeDocument = useSelector<RootState, MergeDocument>((state) => state.IntegrityScope.activeDocument);

    const headerHeight = React.useMemo(() => theme.nanga.getMergeViewFormHeight(isOpenedFrom), [isOpenedFrom]);

    const classes = useStyles(item);
    const [t] = useTranslation('translation');
    const { isLoading, wrapperLoading } = useWrapperLoading();
    React.useEffect(() => {
        if (type !== IntegrityItemType.MODIFY && type !== IntegrityItemType.MOVED_AND_MODIFY && itemOpen) {
            isItemOpen(false);
        }
    }, [type]);

    const activeDocumentType = activeDocument && activeDocument.type ? activeDocument.type : '';
    const activeNodeType = activeDocument && activeDocument.nodeType ? activeDocument.nodeType : '';

    React.useEffect(() => {
        if (!activeDocumentType || !activeNodeType) {
            setTextFieldName('');
            return;
        }
        comparedFieldsService.getFields(activeDocumentType, activeNodeType).then((fields) => setTextFieldName(fields.textFieldName));
    }, [activeDocumentType, activeNodeType]);

    const renderExpainIcon = (type: IntegrityItemType, position: MOVED_POSITION) => {
        if (type !== IntegrityItemType.MODIFY && (type !== IntegrityItemType.MOVED_AND_MODIFY || position === MOVED_POSITION.OLD)) {
            return null;
        }
        return (
            <Button variant='text' onClick={() => isItemOpen(!itemOpen)}>
                {itemOpen ? <ExpandLessIcon fontSize='medium' /> : <ExpandMoreIcon fontSize='medium' />}
            </Button>
        );
    };

    const openIntegrity = async () => {
        const link = await integrityLinkService.getLink(id);
        openInNewTab(link);
    };

    const addContentItem = () => {
        return wrapperLoading(LOADING_INTEGRITY_CHANGES, () =>
            contentWriterService.copyIntegrityItem(item).then((updatedItem) => {
                editorService.save(updatedItem);
                userActionService.accept(updatedItem);
            })
        );
    };

    const removeContentItem = () => {
        dialogService.show(
            <ConfirmationDialog
                title={t('deleteDialogTitle')}
                message={t('deleteDialogText')}
                onAccept={() => {
                    wrapperLoading(LOADING_INTEGRITY_CHANGES, () => contentWriterService.deleteIntegrityItem(item));
                }}
            />
        );
    };

    const moveContentItem = () => {
        let changedItem = item;
        if (item.movedPosition === MOVED_POSITION.OLD) {
            changedItem = integrityService.getIntegrityItemWithNewPosition(item.id);
        }
        return wrapperLoading(LOADING_INTEGRITY_CHANGES, () =>
            changedItem.type === IntegrityItemType.MOVED ? contentWriterService.moveIntegrityItem(changedItem)
                : contentWriterService.moveAndModifyIntegrityItem(changedItem, () => saveFields(extractAllFieldNames())));
    };

    const addAttachments = (key: string, attachments: AttachmentDetailsDto[]) => {
        const attachment = changedAttachments.find((attachment) => attachment.fieldName === key);
        if (!attachment) {
            return;
        }
        attachments.push(attachment);
    };
    const saveFields = (fieldKeys: string[]) => {
        const fields = {};
        const attachments = [];
        fieldKeys
            .filter((key) => !readOnlyFields.includes(key))
            .forEach((key) => {
                const field = changedFields[key];
                if (!field) {
                    addAttachments(key, attachments);
                    return;
                }
                if (field.oldValue !== field.newValue) {
                    fields[key] = field.newValue;
                }
            });
        return contentWriterService.editIntegrityItem(item, fields, attachments);
    };

    const saveAllFields = (thenFunc) => {
        wrapperLoading(LOADING_INTEGRITY_CHANGES, () =>
            saveFields(extractAllFieldNames()).then(() => {
                thenFunc();
                userActionService.accept(item);
            })
        );
    };

    const getAcceptAction = () => {
        switch (type) {
            case IntegrityItemType.NEW:
                return addContentItem();
            case IntegrityItemType.DELETE:
                return removeContentItem();
            case IntegrityItemType.MODIFY:
                return saveAllFields(() => editorService.save(item));
            case IntegrityItemType.MOVED:
            case IntegrityItemType.MOVED_AND_MODIFY:
                return moveContentItem();
        }
    };

    const getDeclineAction = () => {
        if (item.movedPosition === MOVED_POSITION.OLD) {
            item = integrityService.getIntegrityItemById(item.id + MOVED_POSITION.NEW);
        }
        const sendDeclineUserAction = () => {
            wrapperLoading(LOADING_INTEGRITY_CHANGES, () => userActionService.decline(item));
        };
        switch (type) {
            case IntegrityItemType.NEW:
                return contentWriterService.declineAddedIntegrityItem(item);
            case IntegrityItemType.DELETE:
                editorService.save(item);
                return sendDeclineUserAction();
            case IntegrityItemType.MODIFY:
                editorService.saveWithChangedFields(item, [], IntegrityItemType.NONE);
                return sendDeclineUserAction();
            case IntegrityItemType.MOVED:
            case IntegrityItemType.MOVED_AND_MODIFY:
                return contentWriterService.declineMoveIntegrityItem(item);
        }
    };

    const handleAcceptAsSelection = async () => {
        await saveFields(selectedFields);
        if (type === IntegrityItemType.MOVED_AND_MODIFY) {
            await editorService.saveWithChangedFields(item, selectedFields, IntegrityItemType.MOVED);
            const oldPositionItem = integrityService.getIntegrityItemById(item.id + MOVED_POSITION.OLD);
            return editorService.saveWithChangedFields(oldPositionItem, selectedFields, IntegrityItemType.MOVED);
        }
        return editorService.saveWithChangedFields(item, selectedFields, IntegrityItemType.NONE);
    };

    const onAcceptSelectionFields = () => {
        wrapperLoading(LOADING_INTEGRITY_CHANGES, handleAcceptAsSelection);
    };

    const jumpToPosition = () => {
        const relatedId = id + (movedPosition === MOVED_POSITION.OLD ? MOVED_POSITION.NEW : MOVED_POSITION.OLD);
        mergeViewService.scrollToItem(relatedId, headerHeight);
    };

    const changedFieldContainOnlyUnsupportedField = (changedFields: string[]) => {
        if (type !== IntegrityItemType.MODIFY && type !== IntegrityItemType.MOVED_AND_MODIFY) {
            return false;
        }
        if (changedFields.length === 0) {
            return false;
        }
        return !changedFields.some((fieldName) => !readOnlyFields.includes(fieldName));
    };
    const constraintParents = getConstraintParents(item);

    const extractItemIdForItemHead = () => {
        if (INTEGRITY_ITEM_MODIFY_TYPES.includes(item.type)) {
            return item.secondaryId;
        }
        return getId(item);
    };

    const extractAllFieldNames = () => {
        return Object.keys(changedFields).concat(changedAttachments.map((attachment) => attachment.fieldName));
    };
    const title = section + ' ' + category;

    const containsChangedText = () => {
        if (!INTEGRITY_ITEM_MODIFY_TYPES.includes(item.type)) {
            return false;
        }
        return Object.keys(changedFields).some((fieldName) => fieldName === textFieldName);
    };
    const isContainsChangedField = containsChangedText();
    const isMoved = type === IntegrityItemType.MOVED || type === IntegrityItemType.MOVED_AND_MODIFY;
    const content = isMoved && movedPosition === MOVED_POSITION.OLD ? '' : text;
    const isContainsUnsupportedFieldsOnly = changedFieldContainOnlyUnsupportedField(extractAllFieldNames());
    return (
        <>
            {isLoading(LOADING_INTEGRITY_CHANGES) && <NDMLoaderPage />}
            <Paper ref={ref} className={classes.container} id={getId(item)} elevation={isFocused ? DEFAULT_FOCUSED_ITEM_EVALUATION : DEFAULT_ITEM_EVALUATION}>
                {itemOpen ? (
                    <NDMItegrityItemTable
                        oldId={item.id}
                        newId={item.secondaryId}
                        title={title}
                        changedAttachments={changedAttachments}
                        changedFields={changedFields}
                        selectionValues={selectedFields}
                        onSelection={setSelectedFields}
                    />
                ) : (
                    <NDMIntegrityItemHead
                        itemId={extractItemIdForItemHead()}
                        title={title}
                        content={content}
                        oldId={item.id}
                        newId={item.secondaryId}
                        changedField={isContainsChangedField ? changedFields[textFieldName] : null}
                        isShowDiff={isContainsChangedField}
                        type={item.type}
                    />
                )}
                <Grid container justifyContent='space-between' className={classes.buttons}>
                    <Grid item lg={10}>
                        <Button variant='contained' color='info' onClick={openIntegrity} sx={{ mr: 1 }}>
                            ID {id}
                        </Button>
                        {!itemOpen && type !== IntegrityItemType.NONE && (
                            <>
                                <NDMIntegrityItemAction
                                    variant='contained'
                                    constraintParents={constraintParents}
                                    onClick={() => {
                                        getAcceptAction();
                                    }}
                                    containsUnsupportedFieldsOnly={isContainsUnsupportedFieldsOnly}
                                    startIcon={<CheckIcon />}
                                    sx={{ mr: 1 }}
                                >
                                    {t('accept')}
                                </NDMIntegrityItemAction>
                                <NDMIntegrityItemAction
                                    variant='contained'
                                    constraintParents={constraintParents}
                                    onClick={() => {
                                        getDeclineAction();
                                    }}
                                    startIcon={<CancelIcon />}
                                    sx={{ mr: 1 }}
                                >
                                    {t('decline')}
                                </NDMIntegrityItemAction>
                            </>
                        )}
                        {itemOpen && (
                            <NDMIntegrityItemAction
                                variant='contained'
                                disabled={!selectedFields.length}
                                onClick={onAcceptSelectionFields}
                                startIcon={<CheckIcon />}
                                sx={{ mr: 1 }}
                            >
                                {t('acceptAsSelected')}
                            </NDMIntegrityItemAction>
                        )}
                        {isMoved && (
                            <Button onClick={jumpToPosition} sx={{ mr: 1 }}>
                                {movedPosition === MOVED_POSITION.OLD ? t('jumpToNewPosition') : t('jumpToOldPosition')}
                            </Button>
                        )}
                    </Grid>
                    <Grid item lg={2} justifyContent='flex-end' container className={classes.buttonsControl}>
                        {renderExpainIcon(type, movedPosition)}
                    </Grid>
                </Grid>
                {type !== IntegrityItemType.NONE ? <Box className={classes.box} /> : null}
            </Paper>
        </>
    );
});
