import * as React from 'react';
import { Badge, Box, Button, Grid, IconButton, useTheme } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FilterService, MergeViewService } from '@service';
import { FieldFilter, IntegrityItem, IntegrityItemType, TYPES } from '@data';
import { RootState } from '@reducer';
import { useSelector } from 'react-redux';
import { COLORS } from '@theme';
import { useTranslation } from 'react-i18next';
import { debounce, getId } from '@utils';
import { NDMFieldsFilter, NDMNavigationSettings, NDMTopSearch } from '@component';

export const NDMTopControls: React.FC = () => {
    const mergeViewService = DIContainer.get<MergeViewService>(TYPES.MERGE_VIEW_SERVICE);
    const filterService = DIContainer.get<FilterService>(TYPES.FILTER_SERVICE);

    const isOpened = useSelector<RootState, boolean>((state) => state.MergeViewScope.isOpenMergeConditions);
    const integrityItems = useSelector<RootState, IntegrityItem[]>((state) => state.IntegrityScope.integrityItems);
    const filterValues = useSelector<RootState, IntegrityItemType[]>((state) => state.FilterScope.filterValues);
    const fieldFilters = useSelector<RootState, FieldFilter[]>((state) => state.FilterScope.filledFieldsFilters);
    const searchStr = useSelector<RootState, string>((state) => state.FilterScope.searchStr);
    const [t] = useTranslation('translation');

    const [focusedIndexItem, setFocusedIndexItem] = React.useState<number>(0);

    const isOpenedFrom = useSelector<RootState, boolean>((state) => state.MergeViewScope.isOpenMergeConditions);

    const theme = useTheme();

    const headerHeight = React.useMemo(() => theme.nanga.getMergeViewFormHeight(isOpenedFrom), [isOpenedFrom]);

    const changedItems = React.useMemo<IntegrityItem[]>(() => {
        const visibleItems = filterService.getFilteredItems(integrityItems);
        return visibleItems.filter((item) => item.type !== IntegrityItemType.NONE);
    }, [integrityItems, filterValues, fieldFilters, searchStr]);

    const calcFocusedItem = () => {
        if (!changedItems.length) {
            return;
        }
        setFocusedIndexItem(mergeViewService.getFocusedIndexItem(changedItems, headerHeight));
    };

    React.useEffect(() => {
        calcFocusedItem();
        const onScrollDebounce = debounce(calcFocusedItem, 20);
        window.addEventListener('scroll', onScrollDebounce);
        return () => window.removeEventListener('scroll', onScrollDebounce);
    }, [changedItems, isOpenedFrom]);

    const scrollByChangedItemIndex = (index: number) => {
        const target = changedItems[index];
        if (!target) {
            return;
        }
        const id = getId(target);
        mergeViewService.setFocusedItemId(id);
        setFocusedIndexItem(index);
        mergeViewService.scrollToItem(id, headerHeight);
    };

    return (
        <Box mt={1}>
            <Grid container justifyContent={'flex-end'}>
                <Grid container item lg={4} />
                <Grid container item lg={4} justifyContent={'center'} alignItems={'center'}>
                    {!!changedItems.length && (
                        <>
                            <Button
                                disabled={!focusedIndexItem}
                                onClick={() => scrollByChangedItemIndex(focusedIndexItem - 1)}
                                startIcon={<ArrowBackIcon />}
                                sx={{ mr: 1 }}
                            >
                                {t('previous')}
                            </Button>
                            {focusedIndexItem === null ? 0 : focusedIndexItem + 1}/{changedItems.length}
                            <Button
                                disabled={focusedIndexItem === changedItems.length - 1}
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => scrollByChangedItemIndex(focusedIndexItem === null ? 0 : focusedIndexItem + 1)}
                                sx={{ ml: 1 }}
                            >
                                {t('next')}
                            </Button>
                        </>
                    )}
                </Grid>
                <Grid container item lg={4} justifyContent={'flex-end'} alignItems={'start'}>
                    <NDMTopSearch />
                    <NDMFieldsFilter />
                    <NDMNavigationSettings />
                    <IconButton onClick={() => mergeViewService.changeVisibleMergeConditions()}>
                        {isOpened ? <KeyboardArrowUpIcon htmlColor={COLORS.nangaRed} /> : <KeyboardArrowDownIcon htmlColor={COLORS.nangaRed} />}
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    );
};
