import React from 'react';
import { AlertDialog } from '@component';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';

interface BaselineConfirmDialogProps {
    onAccept?: () => void;
}

export const BaselineAlertDialog: React.FC<BaselineConfirmDialogProps> = ({ onAccept }) => {
    const [t] = useTranslation('translation');

    return <AlertDialog onAccept={onAccept} text={<Typography color={(theme) => theme.palette.text.primary}>{t('noPossibleBaselineMerge')}</Typography>} />;
};
