import React from 'react';
import { DialogContext } from '@component';
import { Button, Dialog, DialogActions, DialogContentText, DialogTitle } from '@mui/material';
import { DialogService } from '@service';
import { TYPES } from '@data';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
    title?: React.ReactNode;
    text: React.ReactNode;
    onAccept?: () => void;
}

export const AlertDialog: React.FC<ConfirmDialogProps> = ({ onAccept, text, title }) => {
    const dialogService = DIContainer.get<DialogService>(TYPES.DIALOG_SERVICE);
    const dialogContext = React.useContext<DialogContext>(DialogContext);
    const [t] = useTranslation('translation');

    return (
        <Dialog open>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContentText mt={2} pl={2}>
                {text}
            </DialogContentText>
            <DialogActions>
                <Button
                    onClick={() => {
                        if (onAccept) {
                            onAccept();
                        }
                        dialogService.hide(dialogContext);
                    }}
                    color='primary'
                >
                    {t('ok')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
