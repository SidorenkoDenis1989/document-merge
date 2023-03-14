import * as React from 'react';
import { useHostId } from '@utils';
import { useNavigate } from 'react-router-dom';
import { loginPagePath, TYPES } from '@data';
import { ErrorDialog } from '@component';
import { DialogService } from '@service';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles<Theme>((theme) => ({
    ndmGuard: {
        width: '100%',
        height: '100%',
    },
}));

export const NDMGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const dialogService = DIContainer.get<DialogService>(TYPES.DIALOG_SERVICE);
    const [hostId] = useHostId();
    const navigate = useNavigate();
    const classes = useStyles();

    const onClose = () => {
        dialogService.hideAll();
        navigate(loginPagePath);
    };

    if (!hostId) {
        dialogService.show(<ErrorDialog error='Incorrect hostId parameter' onClose={onClose} />);
        return <div className={classes.ndmGuard} />;
    }

    return <>{children}</>;
};
