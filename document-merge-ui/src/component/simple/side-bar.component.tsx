import '@resources/sass/component/side-bar.component.sass';
import * as React from 'react';
import { Grid } from '@mui/material';

export interface SideBarProps {
    children: React.ReactNode;
}

export const SideBar: React.FC<SideBarProps> = ({ children }) => {
    return (
        <div className={'sidebar grey-background height-full-screen'}>
            <Grid container className='sidebar__container'>
                <Grid item xs={11}>
                    {children}
                </Grid>
            </Grid>
        </div>
    );
};
