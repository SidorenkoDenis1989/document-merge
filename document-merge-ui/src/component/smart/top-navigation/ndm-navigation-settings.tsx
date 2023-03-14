import React from 'react';
import { FormControlLabel, IconButton, Popover, Switch } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { COLORS } from '@theme';
import { useTranslation } from 'react-i18next';
import { SIZE_PX, TYPES } from '@data';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer';
import { MergeViewService } from '@service';

export const NDMNavigationSettings: React.FC = () => {
    const mergeViewService = DIContainer.get<MergeViewService>(TYPES.MERGE_VIEW_SERVICE);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [t] = useTranslation('translation');
    const isMergeHistoryDisabled = useSelector<RootState, boolean>((state) => state.MergeViewScope.isHideMergeHistory);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleSwitch = () => mergeViewService.toggleIsHideMergeHistory();

    return (
        <>
            <IconButton onClick={handleClick}>
                <MoreVertIcon htmlColor={COLORS.nangaRed} />
            </IconButton>
            <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: SIZE_PX.popover.verticalOffset,
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <FormControlLabel
                    label={t('ignoreMergeHistory')}
                    sx={{
                        paddingLeft: 2,
                        paddingTop: 1,
                        paddingBottom: 1,
                    }}
                    control={<Switch checked={isMergeHistoryDisabled} onChange={handleSwitch} />}
                />
            </Popover>
        </>
    );
};
