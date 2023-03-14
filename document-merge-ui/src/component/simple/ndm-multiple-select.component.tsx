import React from 'react';
import { v1 as uuid } from 'uuid';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

interface NabMultipleSelectProps {
    value: string[];
    label?: string;
    items: string[];
    onChange: (newValue: string[]) => void;
    className?: string;
}

export const NDMMultipleSelect: React.FC<NabMultipleSelectProps> = ({ items, label, onChange, className, ...props }) => {
    const { current: labelId } = React.useRef<string>(uuid());

    const value = props.value || [];

    return (
        <FormControl className={className}>
            {label && (
                <InputLabel id={labelId} className={value.length ? 'MuiFormLabel-filled' : ''}>
                    {label}
                </InputLabel>
            )}
            <Select labelId={labelId} multiple={true} value={value} onChange={(event) => onChange(event.target.value as string[])}>
                {items.map((itemName) => (
                    <MenuItem key={itemName} value={itemName}>
                        {itemName}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
