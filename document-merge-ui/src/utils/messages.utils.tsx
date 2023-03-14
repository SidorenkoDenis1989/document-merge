import { DialogService } from '@service';
import { IntegrityItem, TYPES } from '@data';
import React from 'react';
import { ErrorDialog, SaveMessage } from '@component';

export const showSaveMessage = () => {
    const dialogService = DIContainer.get<DialogService>(TYPES.DIALOG_SERVICE);
    dialogService.show(<SaveMessage />);
};

export const showErrorMessage = (error: string, redirectTo?: string) => {
    const dialogService = DIContainer.get<DialogService>(TYPES.DIALOG_SERVICE);

    dialogService.show(
        <ErrorDialog
            error={error}
            onClose={() => {
                redirectTo ? (window.location.hash = redirectTo) : null;
                dialogService.hideAll();
            }}
        />
    );
};

const ID_TEMPLATE = '[id]';
export const showOrderDecisionErrorMessage = (item: IntegrityItem) => {
    const dialogService = DIContainer.get<DialogService>(TYPES.DIALOG_SERVICE);

    dialogService.show(<ErrorDialog
        error={''}
        getTranslatedError={t => t('orderDecisionError').replace(ID_TEMPLATE, item.id)}
        onClose={(dialogId) => dialogService.hide(dialogId)} />);
};
