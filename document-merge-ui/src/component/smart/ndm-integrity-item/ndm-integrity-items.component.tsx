import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer';
import { FieldFilter, IntegrityItem, IntegrityItemType, TYPES } from '@data';
import { Grid } from '@mui/material';
import { NDMIntegrityItem } from '@component';
import { FilterService, IntegrityService, MergeViewService } from '@service';
import { getId } from '@utils';

export const NDMIntegrityItems: React.FC = () => {
    const mergeViewService = DIContainer.get<MergeViewService>(TYPES.MERGE_VIEW_SERVICE);
    const integrityService = DIContainer.get<IntegrityService>(TYPES.INTEGRITY_SERVICE);
    const filterService = DIContainer.get<FilterService>(TYPES.FILTER_SERVICE);

    const integrityItems = useSelector<RootState, IntegrityItem[]>((state) => state.IntegrityScope.integrityItems);
    const filterValues = useSelector<RootState, IntegrityItemType[]>((state) => state.FilterScope.filterValues);
    const fieldFilters = useSelector<RootState, FieldFilter[]>((state) => state.FilterScope.filledFieldsFilters);
    const searchStr = useSelector<RootState, string>((state) => state.FilterScope.searchStr);
    const focusedId = useSelector<RootState, string>((state) => state.MergeViewScope.focusedItemId);

    const applyOnUnmount = () => {
        mergeViewService.cleanItemsRefs();
        integrityService.cleanIntegrityItems();
    };
    React.useEffect(() => () => applyOnUnmount(), []);

    const items = React.useMemo(() => {
        return filterService.getFilteredItems(integrityItems);
    }, [integrityItems, filterValues, fieldFilters, searchStr]);

    if (!items) {
        return null;
    }

    return (
        <Grid
            item
            sx={{
                flexGrow: 1,
                paddingBottom: 3.5,
            }}
            maxWidth={'100%'}
        >
            {items.map((item, index) => (
                <NDMIntegrityItem ref={(el) => mergeViewService.updateItemRef(el, index)} item={item} isFocused={focusedId === getId(item)} key={getId(item)} />
            ))}
        </Grid>
    );
};
