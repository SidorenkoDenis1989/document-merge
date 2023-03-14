import React from 'react';
import { NDMFieldsFilterRowField, NDMFieldsFilterRowValue } from '@component';
import { Grid, IconButton } from '@mui/material';
import { FIELD_FILTER_OPERATORS, FIELD_FILTER_TYPE_OPERATORS, FieldDefinition, FieldFilter, INTEGRITY_FIELDTYPE, LOGIC_OPERATORS } from '@data';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer';
import CloseIcon from '@mui/icons-material/Close';
import { TFunction } from 'i18next';

const DEFAULT_TYPE_OPERATORS = [
    FIELD_FILTER_OPERATORS.CONTAINS,
    FIELD_FILTER_OPERATORS.STARTS_WITH,
    FIELD_FILTER_OPERATORS.ENDS_WITH,
    FIELD_FILTER_OPERATORS.IS_EMPTY,
    FIELD_FILTER_OPERATORS.IS_NOT_EMPTY,
];

const getLogicalConditions = (t: TFunction): Option<LOGIC_OPERATORS>[] => {
    return [
        { value: LOGIC_OPERATORS.AND, label: t('and') },
        { value: LOGIC_OPERATORS.OR, label: t('or') },
    ];
};

interface NDMFieldsFilterRowProps {
    isFirst?: boolean;
    isSmallSize?: boolean;
    filter: FieldFilter;
    onRemove: (filter: FieldFilter) => void;
    onUpdate: (filter: FieldFilter) => void;
}

export interface Option<T> {
    value: T;
    label: string;
}

export const NDMFieldsFilterRow: React.FC<NDMFieldsFilterRowProps> = ({ isFirst = false, isSmallSize = false, filter, onRemove, onUpdate }) => {
    const [t] = useTranslation('translation');
    const [filterScope, setFilter] = React.useState<FieldFilter>(filter);
    const { fieldName, logicOperator, operator, value } = filterScope;

    const availableFields = useSelector<RootState, FieldDefinition[]>((store) => store.FilterScope.availableFieldsByType);

    const fieldOptions = React.useMemo<Option<string>[]>(() => {
        return availableFields.map((fieldDefinition) => ({
            value: fieldDefinition.name,
            label: fieldDefinition.displayName,
        }));
    }, [availableFields]);

    const updateFilter = () => {
        onUpdate(filterScope);
    };

    const getFieldType = (availableFields: FieldDefinition[], fieldName: string) => {
        if (!availableFields || !fieldName) {
            return;
        }
        return availableFields.find((availableField) => availableField.name === fieldName)?.type;
    };
    const fieldType = React.useMemo<string>(() => getFieldType(availableFields, fieldName), [availableFields, fieldName]);

    const cleanDataOnChangeType = (fieldType: string) => {
        if (fieldType === INTEGRITY_FIELDTYPE.PICK || fieldType === INTEGRITY_FIELDTYPE.DATE) {
            setFilter((filter) => ({ ...filter, operator: null, value: null }));
        }
    };
    const onChangeField = (fieldName: string) => {
        setFilter((filter) => ({ ...filter, fieldName }));
        cleanDataOnChangeType(getFieldType(availableFields, fieldName));
        cleanDataOnChangeType(fieldType);
    };
    const getLabel = (operatorValue: FIELD_FILTER_OPERATORS): string => {
        const labels = {
            [FIELD_FILTER_OPERATORS.BEFORE]: t('before'),
            [FIELD_FILTER_OPERATORS.AFTER]: t('after'),
            [FIELD_FILTER_OPERATORS.EQUAL]: t('equals'),
            [FIELD_FILTER_OPERATORS.NOT_EQUAL]: t('notEquals'),
            [FIELD_FILTER_OPERATORS.CONTAINS]: t('contains'),
            [FIELD_FILTER_OPERATORS.STARTS_WITH]: t('startsWith'),
            [FIELD_FILTER_OPERATORS.ENDS_WITH]: t('endsWith'),
            [FIELD_FILTER_OPERATORS.IS_EMPTY]: t('isEmpty'),
            [FIELD_FILTER_OPERATORS.IS_NOT_EMPTY]: t('isNotEmpty'),
        };

        return labels[operatorValue];
    };

    const operatorOptions = React.useMemo<Option<FIELD_FILTER_OPERATORS>[]>(() => {
        const operators = (fieldType && FIELD_FILTER_TYPE_OPERATORS[fieldType]) || DEFAULT_TYPE_OPERATORS;
        return operators.map((operator) => ({ value: operator, label: getLabel(operator) }));
    }, [fieldType]);

    return (
        <Grid container spacing={2} pb={1}>
            {!isSmallSize && (
                <Grid item xs={2} display='flex' alignItems='end'>
                    {!isFirst && (
                        <NDMFieldsFilterRowField<LOGIC_OPERATORS>
                            onBlur={updateFilter}
                            label={t('labelLogicOperator')}
                            value={logicOperator}
                            options={getLogicalConditions(t)}
                            onChange={(logicOperator) => setFilter((filter) => ({ ...filter, logicOperator }))}
                        />
                    )}
                </Grid>
            )}
            <Grid item xs={isSmallSize ? 4 : 3} display='flex' alignItems='end'>
                <NDMFieldsFilterRowField<string>
                    onBlur={updateFilter}
                    label={t('labelField')}
                    value={fieldName}
                    options={fieldOptions}
                    onChange={onChangeField}
                />
            </Grid>
            <Grid item xs={3} display='flex' alignItems='end'>
                <NDMFieldsFilterRowField<FIELD_FILTER_OPERATORS>
                    onBlur={updateFilter}
                    label={t('labelOperator')}
                    value={operator}
                    options={operatorOptions}
                    onChange={(operator) => setFilter((filter) => ({ ...filter, operator }))}
                />
            </Grid>
            <Grid item xs={isSmallSize ? 4 : 3} display='flex' alignItems='end'>
                <NDMFieldsFilterRowValue
                    onBlur={updateFilter}
                    fieldName={fieldName}
                    fieldType={fieldType}
                    operator={operator}
                    label={t('labelValue')}
                    value={value}
                    onChange={(value) => setFilter((filter) => ({ ...filter, value }))}
                />
            </Grid>
            <Grid item xs={1} display='flex' alignItems='end'>
                <IconButton onClick={() => onRemove(filter)}>
                    <CloseIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
};
