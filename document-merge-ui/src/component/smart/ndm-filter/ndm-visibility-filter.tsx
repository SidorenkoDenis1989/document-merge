import React from 'react';
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FilterVisibilityValues, IntegrityItemType, TYPES } from '@data';
import { FilterService } from '@service';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer';

export const NDMVisibilityFilter: React.FC = () => {
    const filterService = DIContainer.get<FilterService>(TYPES.FILTER_SERVICE);
    const filterValues = useSelector<RootState, IntegrityItemType[]>((state) => state.FilterScope.filterValues);

    const [t] = useTranslation('translation');

    const handleChange = (state: React.ChangeEvent<HTMLInputElement>) => {
        const newFilterValues = [...filterValues];

        if (state.target.value === FilterVisibilityValues.VISIBLE) {
            newFilterValues.push(IntegrityItemType.NONE);
            filterService.setFilterValues(newFilterValues);
            return;
        }

        filterService.setFilterValues(newFilterValues.filter((value) => value !== IntegrityItemType.NONE));
    };

    return (
        <Box pl={1.5} width='100%'>
            <FormControl>
                <Box px={0.5} pl={1.5}>
                    <FormLabel color='secondary' focused>
                        {t('unchangedItems')}
                    </FormLabel>
                </Box>
                <RadioGroup defaultValue={FilterVisibilityValues.VISIBLE} name='unchanged-items-filter' onChange={handleChange}>
                    <FormControlLabel value={FilterVisibilityValues.INVISIBLE} control={<Radio />} label={t('invisible')} />
                    <FormControlLabel value={FilterVisibilityValues.VISIBLE} control={<Radio />} label={t('visible')} />
                </RadioGroup>
            </FormControl>
        </Box>
    );
};
