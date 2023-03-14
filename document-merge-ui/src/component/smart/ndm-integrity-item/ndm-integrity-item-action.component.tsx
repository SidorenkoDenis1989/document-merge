import React from 'react';
import {Box, Button, ButtonProps, SxProps, Tooltip} from '@mui/material';
import {RootState} from '@reducer';
import {useSelector} from 'react-redux';
import {BaselineAlertDialog} from '@component';
import {DialogService} from '@service';
import {IntegrityItem, TYPES} from '@data';
import {COLORS} from '@theme';
import {useTranslation} from 'react-i18next';

interface NDMIntegrityItemActionProps {
    constraintParents?: IntegrityItem[];
    containsUnsupportedFieldsOnly?: boolean;
}

export const NDMIntegrityItemAction: React.FC<ButtonProps & NDMIntegrityItemActionProps> = ({ constraintParents = [], containsUnsupportedFieldsOnly = false, ...props}) => {
    const dialogService = DIContainer.get<DialogService>(TYPES.DIALOG_SERVICE);
    const [t] = useTranslation('translation');

    const isBaselineReadOnly = useSelector<RootState, boolean>((state) => state.MergeViewScope.isReadOnly);
    const isConstraintParents = !!constraintParents.length;
    const isReadOnly = isBaselineReadOnly || isConstraintParents;

    const onClick = (event) => {
        if (isBaselineReadOnly) {
            return dialogService.show(<BaselineAlertDialog/>);
        }
        if (isConstraintParents) {
            return;
        }
        props.onClick(event);
    };

    const styles = React.useMemo<SxProps>(() => {
        const styles = props.sx ? { ...props.sx } : {};
        if (isReadOnly) {
            // @ts-ignore
            styles.bgcolor = COLORS.lightGrey;
        }
        return styles;
    }, [isReadOnly, props.sx]);

    const renderButton = (isDisabled: boolean) => {
        return <Button {...props} sx={styles} disabled={isDisabled} onClick={onClick}/>;
    };

    if (!isBaselineReadOnly && isConstraintParents) {
        return <Tooltip title={t('makeDecisionForParentFirst')} followCursor arrow>
            <Box display='inline-block'>
                {renderButton(true)}
            </Box>
        </Tooltip>;
    }

    if (containsUnsupportedFieldsOnly) {
        return (<Tooltip title={t('unsupportedForMergeFields')}>
            <span>
            {renderButton(true)}
            </span>
        </Tooltip>)
    }
    return renderButton(props.disabled);
};
