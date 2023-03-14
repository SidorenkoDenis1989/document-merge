import React from 'react';
import { DialogContext } from '@component';
import { Button, Dialog, DialogActions, DialogContentText, DialogTitle } from '@mui/material';
import { DialogService } from '@service';
import { TYPES } from '@data';
import { useTranslation } from 'react-i18next';

interface DeleteDialogProps {
    title: string;
    message: string;
    onAccept: () => void;
}

export const ConfirmationDialog: React.FC<DeleteDialogProps> = ({ onAccept, title, message }) => {
    const dialogService = DIContainer.get<DialogService>(TYPES.DIALOG_SERVICE);
    const dialogContext = React.useContext<DialogContext>(DialogContext);

    const [t] = useTranslation('translation');

    return (
        <Dialog aria-labelledby='simple-dialog-title' open>
            <DialogTitle>{title}</DialogTitle>
            <DialogContentText pl={2}>{message}</DialogContentText>
            <DialogActions>
                <Button
                    onClick={() => {
                        onAccept();
                        dialogService.hide(dialogContext);
                    }}
                    color='primary'
                >
                    OK
                </Button>
                <Button
                    onClick={() => {
                        dialogService.hide(dialogContext);
                    }}
                    color='primary'
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
