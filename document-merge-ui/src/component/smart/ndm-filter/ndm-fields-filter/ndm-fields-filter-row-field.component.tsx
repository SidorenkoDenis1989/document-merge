import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { v1 as uuid } from 'uuid';
import { Option } from '@component/smart/ndm-filter/ndm-fields-filter/ndm-fields-filter-row.component';

interface FieldProps<T> {
    onBlur: () => void;
    isDisabled?: boolean;
    label: string;
    value: T;
    options: Option<T>[];
    onChange: (value: T) => void;
}

export const NDMFieldsFilterRowField = <T,>({ value, label, isDisabled, options, onChange, onBlur }: FieldProps<T>) => {
    const labelId = React.useRef(uuid());

    return (
        <FormControl fullWidth>
            <InputLabel id={labelId.current}>{label}</InputLabel>
            <Select
                onBlur={onBlur}
                labelId={labelId.current}
                disabled={isDisabled}
                value={value}
                label={label}
                variant='standard'
                onChange={(event) => onChange(event.target.value as T)}
            >
                {options.map((option) => (
                    // @ts-ignore
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
