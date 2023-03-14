import React from 'react';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import { makeStyles, styled } from '@mui/styles';
import {Theme, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {FieldsDefinitionsService} from '@service';
import { AttachmentDetailsDto, ChangedField, FieldDefinition, TEXT_TYPES, TYPES } from '@data';
import {getActiveHostId, replaceEnterValue} from '@utils';
import {NDMItegrityItemDiff} from '@component';
import {useSelector} from "react-redux";
import {RootState} from "@reducer";
import { COLORS } from '@theme';

const renderFileNameCell = (oldId: string, newId: string, type: FieldType, itemId: string, fieldName: string, fieldContent: string, diffFieldContent?: string) => {
    return type === FieldType.ATTACHMENT ? (
        <a
            href={`/user/documents/attachment?hostId=${getActiveHostId()}&itemId=${itemId}&attachmentName=${fieldContent}&fieldName=${fieldName}`}
            download={fieldContent}
        >
            {fieldContent}
        </a>
    ) : diffFieldContent ? (
        <SecondaryFieldValue fieldName={fieldName} oldId={oldId} newId={newId} fieldContent={fieldContent}
                             diffFieldContent={diffFieldContent}/>
    ) : (
        <div dangerouslySetInnerHTML={{ __html: replaceEnterValue(fieldContent, oldId) }}/>
    );
};

const getColumns = (oldId: string, newId: string): GridColDef[] => {
    const [t] = useTranslation('translation');

    return [
        {field: 'field', headerName: t('fieldColumnName'), width: 250},
        {
            field: 'oldValue',
            headerName: t('primaryValueColumnName'),
            flex: 1,
            renderCell: ({row}) => renderFileNameCell(oldId, newId, row.type, row.oldItemId, row.field, row.oldValue),
        },
        {
            field: 'newValue',
            headerName: t('secondaryValueColumnName'),
            flex: 1,
            renderCell: ({row}) => renderFileNameCell(oldId, newId, row.type, row.newItemId, row.field, row.newValue, row.oldValue),
        },
    ];
};

enum FieldType {
    ATTACHMENT = 'attachment',
    DEFAULT = 'none',
}

interface FieldRow {
    id: string;
    field: string;
    oldValue: string;
    newValue: string;
    type: string;
}

const useTitleStyles = makeStyles<Theme>({
    title: {
        marginBottom: '10px',
    },
});

export interface NDMItegrityItemTableProps {
    title: string;
    oldId: string;
    newId: string;
    changedFields: { [key: string]: ChangedField };
    changedAttachments: AttachmentDetailsDto[];
    onSelection: (values: string[]) => void;
    selectionValues: string[];
}

const DEFAULT_ROWS = 5;
export const NDMItegrityItemTable: React.FC<NDMItegrityItemTableProps> = ({
                                                                              oldId,
                                                                              newId,
                                                                              title,
                                                                              changedFields,
                                                                              changedAttachments,
                                                                              onSelection,
                                                                              selectionValues
                                                                          }) => {
    const fieldsDefinitionsService = DIContainer.get<FieldsDefinitionsService>(TYPES.FIELDS_DEFINITIONS_SERVICE);

    const titleClasses = useTitleStyles();
    const [rows, setRows] = React.useState<FieldRow[]>([]);
    const readOnlyFields = useSelector<RootState, string[]>((state) => state.ApplicationInfoScope.readOnlyFields);

    const processChangedFields = async () => {
        const definitions = await fieldsDefinitionsService.getSortedDefinitionByFields(Object.keys(changedFields));
        const rows: FieldRow[] = definitions.map((definition) => ({
            id: definition.name,
            field: definition.displayName,
            oldValue: changedFields[definition.name].oldValue,
            newValue: changedFields[definition.name].newValue,
            type: FieldType.DEFAULT,
        }));
        const changeAttachmentsValue = changedAttachments.map((attachment) => ({
            id: attachment.attachmentId,
            field: attachment.fieldName,
            newValue: attachment.primaryFileName,
            oldValue: attachment.secondaryFileName,
            newItemId: attachment.primaryItemId,
            oldItemId: attachment.secondaryItemId,
            type: FieldType.ATTACHMENT,
        }));
        setRows([...rows, ...changeAttachmentsValue]);
    };
    React.useEffect(() => {
        processChangedFields();
    }, [changedFields]);

    const columns = getColumns(oldId, newId);

    const rowsPerPage = rows.length > DEFAULT_ROWS ? DEFAULT_ROWS : rows.length;

    return (
        <>
            <Typography variant='h5' className={titleClasses.title}>
                {title}
            </Typography>
            <div style={{width: '100%'}}>
                <DataGrid
                    autoHeight
                    getRowHeight={() => 'auto'}
                    rows={rows}
                    columns={columns}
                    rowsPerPageOptions={[rowsPerPage]}
                    checkboxSelection
                    isRowSelectable={(params) => !readOnlyFields.includes(params.row.field)}
                    selectionModel={selectionValues}
                    onSelectionModelChange={(newSelectionModel: string[]) => {
                        onSelection(newSelectionModel);
                    }}
                />
            </div>
        </>
    );
};

interface SecondaryFieldValueProps {
    oldId: string,
    newId: string,
    fieldName: string,
    fieldContent: string,
    diffFieldContent?: string
}

const SecondaryTextContainer = styled('div')({
    background: COLORS.lightYellow,
    "& *": {
        background: COLORS.lightYellow
    }
});
const SecondaryFieldValue: React.FC<SecondaryFieldValueProps> = ({ oldId, newId,  fieldName, fieldContent, diffFieldContent }) => {
    const fieldsDefinitionsService = DIContainer.get<FieldsDefinitionsService>(TYPES.FIELDS_DEFINITIONS_SERVICE);
    const [isTextType, setIsTextType] = React.useState<boolean>(false);

    const isTextToHandling = (fieldDefinition: FieldDefinition): boolean => {
        return TEXT_TYPES.includes(fieldDefinition.type.toUpperCase());
    };
    React.useEffect(() => {
        fieldsDefinitionsService
            .getFieldDefinitionByFields([fieldName])
            .then(fieldDefinitions => setIsTextType (fieldDefinitions[0] ? isTextToHandling(fieldDefinitions[0]): false));
    }, [fieldName]);

    if (!isTextType) {
        return <SecondaryTextContainer dangerouslySetInnerHTML={{ __html: replaceEnterValue(fieldContent, oldId) }}/>;
    }
    return <NDMItegrityItemDiff oldId={oldId} newId={newId} newValue={fieldContent} oldValue={diffFieldContent}/>;
};
