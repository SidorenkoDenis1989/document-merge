import React from 'react';
import { NDMIntegrityItems, NDMFilterContainer, NDMMergeViewFormContainer, NDMDifferenceExportButtons } from '@component';
import { Container, Grid, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer/root.reducer';
import { SIZE_PX } from '@data';

interface StyleProps {
    isOpenedFrom: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
    root: ({ isOpenedFrom }) => ({
        paddingTop: theme.nanga.getMergeViewFormHeight(isOpenedFrom),
        paddingLeft: SIZE_PX.filter.width,
    }),
}));

export const NDMMergeViewPage: React.FC = () => {
    const isOpenedFrom = useSelector<RootState, boolean>((state) => state.MergeViewScope.isOpenMergeConditions);

    return (
        <>
            <NDMMergeViewFormContainer />
            <Container maxWidth={false} disableGutters classes={useStyles({ isOpenedFrom })}>
                <NDMDifferenceExportButtons />
                <Grid container columnSpacing={6.5} wrap={'nowrap'}>
                    <NDMFilterContainer />
                    <NDMIntegrityItems />
                </Grid>
            </Container>
        </>
    );
};
