import React from 'react';
import { Box } from '@mui/system';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles<Theme>((theme) => ({
    root: (maxWidth) => ({
        backgroundColor: theme.nanga.boxBackground,
        maxWidth: `${maxWidth}px`,
        width: '100%',
        borderRadius: '4px',
        padding: '16px',
        position: 'relative',
    }),
}));

export interface ContainerContentProps {
    children: React.ReactNode;
    maxWidth?: number;
    className?: string;
}

export const ContainerContent: React.FC<ContainerContentProps> = ({ children, maxWidth = 500, className }) => {
    const classes = useStyles(maxWidth);

    return (
        <Box display={'flex'} sx={{ height: '100%' }} justifyContent={'center'} alignItems={'center'} className={className}>
            <Box className={classes.root} display={'flex'}>
                {children}
            </Box>
        </Box>
    );
};
