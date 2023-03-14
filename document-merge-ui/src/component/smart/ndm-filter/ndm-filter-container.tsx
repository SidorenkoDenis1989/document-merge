import React from 'react';
import { Grid, Theme } from '@mui/material';
import { NDMVisibilityFilter, NDMChangesFilter } from '@component';
import { SIZE_PX } from '@data';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer/root.reducer';
import { makeStyles } from '@mui/styles';

interface StyleProps {
    isVisibleNavBar: boolean;
    isOpenedForm: boolean;
}
const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
    root: ({ isOpenedForm, isVisibleNavBar }) => ({
        position: 'fixed',
        top: theme.nanga.getMergeViewFormHeight(isOpenedForm) + SIZE_PX.header.height,
        left: theme.nanga.getLeftPositionRelativeSidebar(isVisibleNavBar),
        zIndex: 98,
        width: SIZE_PX.filter.width,
        minWidth: SIZE_PX.filter.width,
        maxHeight: SIZE_PX.filter.height,
    }),
}));

export const NDMFilterContainer: React.FC = () => {
    const isVisibleNavBar = useSelector<RootState, boolean>((state) => state.ApplicationInfoScope.isVisibleNavBar);
    const isOpenedForm = useSelector<RootState, boolean>((state) => state.MergeViewScope.isOpenMergeConditions);

    return (
        <Grid classes={useStyles({ isVisibleNavBar, isOpenedForm })}>
            <NDMVisibilityFilter />
            <NDMChangesFilter />
        </Grid>
    );
};
