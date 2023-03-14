import * as React from 'react';
import { NDMMergeTopBar, NDMTopControls } from '@component';
import { Container, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { SIZE_PX } from '@data/constant/size.constant';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer/root.reducer';

interface StyleProps {
    isVisibleNavBar: boolean;
}
const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
    root: ({ isVisibleNavBar }) => ({
        position: 'fixed',
        left: theme.nanga.getLeftPositionRelativeSidebar(isVisibleNavBar),
        width: `calc(100% - ${theme.nanga.getLeftPositionRelativeSidebar(isVisibleNavBar) + SIZE_PX.pageLayout.padding}px)`,
        zIndex: 99,
        background: theme.palette.background.default,
    }),
}));

export const NDMMergeViewFormContainer: React.FC = () => {
    const isVisibleNavBar = useSelector<RootState, boolean>((state) => state.ApplicationInfoScope.isVisibleNavBar);

    return (
        <Container maxWidth={false} classes={useStyles({ isVisibleNavBar })} disableGutters>
            <NDMMergeTopBar />
            <NDMTopControls />
        </Container>
    );
};
