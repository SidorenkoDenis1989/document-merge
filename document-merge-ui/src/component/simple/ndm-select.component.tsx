import React from 'react';
import { v1 as uuid } from 'uuid';
import { Chip, FormControl, InputLabel, MenuItem, Select, SelectProps } from '@mui/material';

interface NabSelectProps extends SelectProps {
    items: string[] | object[];
    renderItem?: (item: object) => React.ReactNode;
    useNull?: boolean;
}

export const NDMSelect: React.FC<NabSelectProps> = (props) => {
    const { current: labelId } = React.useRef<string>(uuid());

    const renderMenuItem = (item: string | object) => {
        if (props.renderItem) {
            return props.renderItem(item as object);
        }
        const itemName = item as string;
        return (
            <MenuItem key={itemName} value={itemName}>
                {itemName}
            </MenuItem>
        );
    };

    const isValueNotEmpty = (value): boolean => {
        return value && !!value.length;
    };

    return (
        <FormControl className={props.className} fullWidth={props.fullWidth}>
            <InputLabel id={props.labelId} className={isValueNotEmpty(props.value) && 'MuiFormLabel-filled'}>
                {props.label}
            </InputLabel>
            <Select {...props}>
                {props.useNull && (
                    <MenuItem key={null} value={null}>
                        None
                    </MenuItem>
                )}
                {props.items.map(renderMenuItem)}
            </Select>
        </FormControl>
    );
};
