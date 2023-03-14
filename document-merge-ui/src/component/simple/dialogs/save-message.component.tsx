import React from 'react';
import { DialogContext } from '@component';
import { DialogService } from '@service';
import { TYPES } from '@data';
import { Slide, Snackbar } from '@mui/material';

interface SaveMessageProps {
    message?: string;
}

const TRANSITION_TIMEOUT = 225;
const DISPLAY_TIMEOUT = 1000;
export const SaveMessage: React.FC<SaveMessageProps> = (props) => {
    const dialogService = DIContainer.get<DialogService>(TYPES.DIALOG_SERVICE);
    const dialogContext = React.useContext<DialogContext>(DialogContext);

    const [open, setOpen] = React.useState(true);
    React.useEffect(() => {
        setTimeout(() => setOpen(false), DISPLAY_TIMEOUT + TRANSITION_TIMEOUT);
    }, []);

    React.useEffect(() => {
        if (open) {
            return;
        }
        setTimeout(() => dialogService.hide(dialogContext), TRANSITION_TIMEOUT);
    }, [open]);
    const message = props.message ? props.message : 'Changes saved!';
    return <Snackbar open={open} TransitionComponent={SlideTransition} message={message} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} />;
};

const SlideTransition = (props) => {
    return <Slide {...props} timeout={TRANSITION_TIMEOUT} direction='left' />;
};
