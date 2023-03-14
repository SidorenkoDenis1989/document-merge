import React from 'react';
import { IntegrityService } from '@service';
import { FIELD_FILTER_OPERATORS, INTEGRITY_FIELDTYPE, TYPES } from '@data';
import { Option } from '@component/smart/ndm-filter/ndm-fields-filter/ndm-fields-filter-row.component';
import { DateTimePicker } from '@mui/lab';
import { TextField } from '@mui/material';
import { NDMFieldsFilterRowField } from '@component/smart/ndm-filter/ndm-fields-filter/ndm-fields-filter-row-field.component';

interface NDMFieldsFilterRowValueProps {
    operator: FIELD_FILTER_OPERATORS;
    fieldName: string;
    fieldType: string;
    onBlur: () => void;
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export const NDMFieldsFilterRowValue: React.FC<NDMFieldsFilterRowValueProps> = ({ operator, fieldName, fieldType, value, label, onBlur, onChange }) => {
    const integrityService = DIContainer.get<IntegrityService>(TYPES.INTEGRITY_SERVICE);
    const [openCalendar, setOpenCalendar] = React.useState<boolean>(false);
    const [availableValues, setAvailableValues] = React.useState<Option<string>[]>([]);

    const handlePickListValues = (values: string[]) => {
        const options = values.map((value) => ({ value: value, label: value }));
        setAvailableValues(options);
    };
    React.useEffect(() => {
        if (fieldType !== INTEGRITY_FIELDTYPE.PICK) {
            return;
        }
        integrityService.getPickListValues(fieldName).then(handlePickListValues);
        return () => setAvailableValues([]);
    }, [fieldName, fieldType]);

    if (operator === FIELD_FILTER_OPERATORS.IS_EMPTY || operator === FIELD_FILTER_OPERATORS.IS_NOT_EMPTY) {
        return null;
    }
    if (operator === FIELD_FILTER_OPERATORS.BEFORE || operator === FIELD_FILTER_OPERATORS.AFTER) {
        return (
            <DateTimePicker
                open={openCalendar}
                label={label}
                hideTabs={true}
                showToolbar={false}
                onClose={() => {
                    setOpenCalendar(false);
                    onBlur();
                }}
                value={value}
                onChange={(value) => onChange(value)}
                renderInput={(params) => <TextField inputProps={{ readOnly: true }} onClick={() => setOpenCalendar(true)} variant='standard' {...params} />}
            />
        );
    }

    if (fieldType === INTEGRITY_FIELDTYPE.PICK) {
        return <NDMFieldsFilterRowField<string> onBlur={onBlur} label={label} value={value} options={availableValues} onChange={onChange} />;
    }

    return <TextField fullWidth onBlur={onBlur} onChange={(event) => onChange(event.target.value)} label={label} variant='standard' value={value} />;
};
