import '@resources/sass/component/alert.component.sass';
import React from 'react';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import classNames from 'classnames';
import { Paper } from '@mui/material';

export enum AlertType {
    SUCCESS = 'success',
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
}

const IconComponent = {
    [AlertType.SUCCESS]: DoneOutlineIcon,
    [AlertType.INFO]: InfoOutlinedIcon,
    [AlertType.WARNING]: ReportProblemOutlinedIcon,
    [AlertType.ERROR]: ErrorOutlineOutlinedIcon,
};

interface AlertProps {
    type?: AlertType;
    isFullWidth?: boolean;
    children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ children, type = AlertType.SUCCESS, isFullWidth = false }) => {
    const classes = classNames('alert', `alert_type_${type}`, { 'alert_full-width': isFullWidth });
    const Icon = IconComponent[type];
    return (
        <Paper className={classes} elevation={5}>
            <Icon className='alert__icon' />
            {children}
        </Paper>
    );
};
