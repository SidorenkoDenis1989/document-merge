import React from 'react';
import { DialogContext, SaveMessage } from '@component';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { AxiosError } from 'axios';
import { ERROR_CODS } from '@config/axios.config';
import { DialogService } from '@service';
import { TYPES } from '@data';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
interface ErrorDialogProps {
    onClose: (id: string) => void;
    error: string | AxiosError;
    getTranslatedError?: (t: TFunction) => string;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({ onClose, error, getTranslatedError }) => {
    const dialogService = DIContainer.get<DialogService>(TYPES.DIALOG_SERVICE);
    const dialogContext = React.useContext<DialogContext>(DialogContext);
    const [t] = useTranslation('translation');

    if (typeof error === 'object' && error.response && ERROR_CODS.some((erroCode) => error.response.status === erroCode)) {
        return null;
    }

    const getErrorText = (error: string | AxiosError): string => {
        if (getTranslatedError) {
            return getTranslatedError(t);
        }
        if (typeof error === 'object' && !error.code) {
            return error.message ? error.message : 'Something went wrong';
        }
        return error ? error.toString() : 'Something went wrong';
    };

    return (
        <Dialog aria-labelledby='simple-dialog-title' open>
            <DialogTitle id='template-data-dialog-title'>{getErrorText(error)}</DialogTitle>
            <DialogActions>
                <Button
                    onClick={() => {
                        navigator.clipboard.writeText(getErrorText(error));
                        dialogService.show(<SaveMessage message={'Copied!'} />);
                    }}
                    color='primary'
                >
                    Copy
                </Button>
                <Button
                    onClick={() => {
                        onClose(dialogContext);
                    }}
                    color='primary'
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};
