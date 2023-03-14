import '@resources/sass/component/ndm-layout.component.sass';
import React from 'react';
import { NDMHeader, NDMNavBar } from '@component';
import { Container, Theme } from '@mui/material';
import { RootState } from '@reducer';
import { useSelector } from 'react-redux';
import { SIZE_PX } from '@data';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles<Theme>((theme) => ({
    root: (isVisibleNavBar) =>
        isVisibleNavBar
            ? {
                  height: '100%',
                  marginLeft: SIZE_PX.sidebar.maxWidth,
                  width: `calc(100% - ${SIZE_PX.sidebar.maxWidth}px)`,
                  paddingLeft: SIZE_PX.pageLayout.padding,
                  paddingRight: SIZE_PX.pageLayout.padding,
              }
            : {
                  height: '100%',
                  marginLeft: SIZE_PX.sidebar.minWidth,
                  width: `calc(100% - ${SIZE_PX.sidebar.minWidth}px)`,
                  paddingLeft: SIZE_PX.pageLayout.padding,
                  paddingRight: SIZE_PX.pageLayout.padding,
              },
}));

export interface NDMLayoutProps {
    children: React.ReactNode;
}

export const NDMLayout: React.FC<NDMLayoutProps> = ({ children }) => {
    const isVisibleNavBar = useSelector<RootState, boolean>((state) => state.ApplicationInfoScope.isVisibleNavBar);
    const classes = useStyles(isVisibleNavBar);
    return (
        <div className='main-container'>
            <NDMHeader />
            <NDMNavBar />
            <Container classes={classes} maxWidth={false}>
                {children}
            </Container>
        </div>
    );
};
