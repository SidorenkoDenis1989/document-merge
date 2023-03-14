import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

interface SaveButtonProps {
    isDisabled?: boolean;
    onClick: () => void;
    label?: string;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ onClick, isDisabled, label }) => {
    const [t] = useTranslation('translation');
    return (
        <Button disabled={isDisabled} color='primary' onClick={onClick} variant='contained'>
            {label ? label : t('saveChanges')}
        </Button>
    );
};
