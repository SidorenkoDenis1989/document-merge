import React from 'react';
import { Box, Button, IconButton, Popover } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
import { RootState } from '@reducer/root.reducer';
import { useSelector } from 'react-redux';
import { FIELD_FILTER_OPERATORS, FieldDefinition, FieldFilter, LOGIC_OPERATORS, SIZE_PX, TYPES } from '@data';
import { FilterService } from '@service';
import { COLORS } from '@theme';
import { NDMFieldsFilterRow } from '@component';

const compareById = (filterA: FieldFilter, filterB: FieldFilter) => (filterA.id > filterB.id ? 1 : -1);
const trim = (value: string | Date) => {
    if (value instanceof Date) {
        return value;
    }
    return value ? value.trim() : '';
};
const EMPTY_VALUES_OPERATOR = [FIELD_FILTER_OPERATORS.IS_EMPTY, FIELD_FILTER_OPERATORS.IS_NOT_EMPTY];
const isFilled = (filter: FieldFilter) =>
    trim(filter.logicOperator) && trim(filter.fieldName) && trim(filter.operator) && (EMPTY_VALUES_OPERATOR.includes(filter.operator) || trim(filter.value));

export const NDMFieldsFilter: React.FC = () => {
    const isFilterDisabled = useSelector<RootState, boolean>((store) => store.FilterScope.isDisabled);
    const filterService = DIContainer.get<FilterService>(TYPES.FILTER_SERVICE);
    const fieldFilters = useSelector<RootState, FieldFilter[]>((store) => store.FilterScope.fieldsFilters);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const availableFields = useSelector<RootState, FieldDefinition[]>((store) => store.FilterScope.availableFieldsByType);

    React.useEffect(() => {
        const oldFilters = [...filterService.getFilledFieldFilters()];
        oldFilters.sort(compareById);
        const newFilters = fieldFilters.filter(isFilled);
        newFilters.sort(compareById);
        const isNotEquals = JSON.stringify(oldFilters) !== JSON.stringify(newFilters);
        if (isNotEquals) {
            filterService.setFilledFieldFilters(newFilters);
        }
    }, [fieldFilters]);

    React.useEffect(() => {
        if (!availableFields.length) {
            return;
        }
        const newFieldFilters = fieldFilters.filter((filter) => availableFields.some((availableField) => availableField.name === filter.fieldName));
        if (!newFieldFilters.length) {
            filterService.updateFieldsFilters([]);
            return;
        }
        newFieldFilters[0] = { ...newFieldFilters[0], logicOperator: LOGIC_OPERATORS.AND };
        filterService.updateFieldsFilters(newFieldFilters);
    }, [availableFields]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const addFilter = () => {
        filterService.addFieldFilter(new FieldFilter());
    };

    const removeFilter = (filter: FieldFilter) => {
        filterService.removeFieldFilter(filter);
    };
    const updateFilter = (filter: FieldFilter) => {
        filterService.updateFieldFilter(filter);
    };

    const isSmallSize = fieldFilters.length <= 1;
    return (
        <>
            <IconButton onClick={handleClick} disabled={isFilterDisabled}>
                <FilterAltIcon htmlColor={isFilterDisabled ? 'disabled' : COLORS.nangaRed} />
            </IconButton>
            <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: SIZE_PX.popover.verticalOffset,
                    horizontal: 'left',
                }}
            >
                {' '}
                <Box width={isSmallSize ? 650 : 850} sx={{ minHeight: 50 }} p={2}>
                    {fieldFilters.map((filter, index) => (
                        <NDMFieldsFilterRow
                            isFirst={index === 0}
                            isSmallSize={isSmallSize}
                            filter={filter}
                            onRemove={removeFilter}
                            onUpdate={updateFilter}
                            key={filter.id}
                        />
                    ))}
                    <Button variant='contained' startIcon={<AddIcon />} onClick={addFilter}>
                        Add Filter
                    </Button>
                </Box>
            </Popover>
        </>
    );
};
