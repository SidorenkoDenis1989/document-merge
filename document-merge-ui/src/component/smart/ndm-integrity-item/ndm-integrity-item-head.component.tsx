import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Theme, Typography } from '@mui/material';
import { chooseColor, NDMItegrityItemDiff } from '@component';
import { ChangedField, IntegrityItemType } from '@data';
import { replaceEnterValue } from '@utils';

export interface NDMIntegrityItemHeadProps {
    title: string;
    content: string;
    itemId: string;
    type: IntegrityItemType;
    oldId: string;
    newId: string;
    changedField: ChangedField;
    isShowDiff: boolean;
}

const FILLED_COLOR_TYPES = [IntegrityItemType.NEW, IntegrityItemType.DELETE, IntegrityItemType.MOVED, IntegrityItemType.MOVED_AND_MODIFY];
const useStyles = makeStyles<Theme>({
    title: {
        marginBottom: '10px',
    },
    content: {
        backgroundColor: (props: NDMIntegrityItemHeadProps) => {
            return FILLED_COLOR_TYPES.includes(props.type) && chooseColor(props.type);
        },
    },
});

export const NDMIntegrityItemHead: React.FC<NDMIntegrityItemHeadProps> = (props) => {
    const { title, content, itemId, changedField, isShowDiff, newId, oldId } = props;
    const classes = useStyles(props);
    return (
        <Box overflow={'auto'}>
            <Box display={'inline-block'} sx={{ width: 1, overflow: 'hidden' }}>
                <Typography variant='h5' className={classes.title}>
                    {title}
                </Typography>
                {(isShowDiff && changedField) ?
                    <NDMItegrityItemDiff oldId={oldId} newId={newId} newValue={changedField.newValue}
                                         oldValue={changedField.oldValue}/>
                    :
                    <Typography className={classes.content}
                                dangerouslySetInnerHTML={{ __html: replaceEnterValue(content, itemId) }}></Typography>
                }
            </Box>
        </Box>
    );
};
