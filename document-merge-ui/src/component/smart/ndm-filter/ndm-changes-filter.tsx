import React from 'react';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IntegrityItemType, TYPES } from '@data';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer';
import { FilterService } from '@service';

export const NDMChangesFilter: React.FC = () => {
    const filterService = DIContainer.get<FilterService>(TYPES.FILTER_SERVICE);
    const filterValues = useSelector<RootState, IntegrityItemType[]>((state) => state.FilterScope.filterValues);

    const [t] = useTranslation('translation');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFilterValues = [...filterValues];
        const isChecked = event.target.checked;

        if (isChecked) {
            newFilterValues.push(event.target.name as IntegrityItemType);
            filterService.setFilterValues(newFilterValues);
            return;
        }

        filterService.setFilterValues(newFilterValues.filter((value) => value !== event.target.name));
    };

    const isChecked = (filterValue: IntegrityItemType): boolean => {
        if (!filterValues) {
            return true;
        }
        return filterValues.includes(filterValue);
    };

    return (
        <Box pl={1.5} width='100%'>
            <FormControl>
                <Box px={0.5} py={1.5}>
                    <FormLabel color='secondary' focused>
                        {t('showFollowingChanges')}
                    </FormLabel>
                </Box>
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox onChange={handleChange} checked={isChecked(IntegrityItemType.NEW)} name={IntegrityItemType.NEW} />}
                        label={t('new')}
                    />
                    <FormControlLabel
                        control={<Checkbox onChange={handleChange} checked={isChecked(IntegrityItemType.DELETE)} name={IntegrityItemType.DELETE} />}
                        label={t('deleted')}
                    />
                    <FormControlLabel
                        control={<Checkbox onChange={handleChange} checked={isChecked(IntegrityItemType.MODIFY)} name={IntegrityItemType.MODIFY} />}
                        label={t('changed')}
                    />
                    <FormControlLabel
                        control={<Checkbox onChange={handleChange} checked={isChecked(IntegrityItemType.MOVED)} name={IntegrityItemType.MOVED} />}
                        label={t('moved')}
                    />
                </FormGroup>
            </FormControl>
        </Box>
    );
};
