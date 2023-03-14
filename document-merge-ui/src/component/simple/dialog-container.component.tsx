import '@resources/sass/component/dialog-container.component.sass';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer';
import { Dialog } from '@data';

export type DialogContext = string;
export const DialogContext = React.createContext<DialogContext>(null);

export interface DialogContainerProps {
    children: React.ReactNode;
}

export const DialogContainer: React.FC<DialogContainerProps> = ({ children }) => {
    const dialogs = useSelector<RootState, Dialog[]>((state) => state.DialogScope.dialogs);

    return (
        <>
            <div className='dialog-container'>
                {dialogs.map((dialog) => (
                    <DialogContext.Provider value={dialog.key} key={dialog.key}>
                        {dialog.node}
                    </DialogContext.Provider>
                ))}
            </div>
            {children}
        </>
    );
};
