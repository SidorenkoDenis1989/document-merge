import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { Box } from '@mui/material';
import { Option, SIZE_PX } from '@data';
import { useTranslation } from 'react-i18next';
import { COLORS } from '@theme';

interface SplitButtonSelectProps {
    value?: string;
    options: Option[];
    onChange: (value: string) => void;
    isDisabledCurrentOption?: boolean;
    fullWidth?: boolean;
    isLoading?: boolean;
}

export const SplitButtonSelect: React.FC<SplitButtonSelectProps> = ({ value, options, onChange, isDisabledCurrentOption, fullWidth, isLoading }) => {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const { t } = useTranslation('translation');

    const handleMenuItemClick = (value: string) => {
        onChange(value);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    const getCurrentOptionLabel = (): string | number => {
        if (isLoading) {
            return t('loadingText');
        }

        if (!options.length) {
            return t('noOptions');
        }

        if (!value) {
            return options[0].name;
        }

        const currentOption = options.find((option) => option.key === value);
        return currentOption ? currentOption.name : options[0].name;
    };

    return (
        <Box sx={{ width: fullWidth && '100%' }}>
            <ButtonGroup fullWidth={fullWidth} variant='contained' ref={anchorRef} aria-label='split button'>
                <Button
                    sx={{
                        backgroundColor: COLORS.nangaRed + ' !important',
                        color: COLORS.white + ' !important',
                    }}
                    disabled
                >
                    {getCurrentOptionLabel()}
                </Button>
                <Button
                    size='small'
                    onClick={handleToggle}
                    sx={{
                        width: SIZE_PX.splitButtonSelect.arrowWidth,
                        minWidth: `${SIZE_PX.splitButtonSelect.arrowWidth}px !important`,
                    }}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal sx={{ zIndex: 2 }}>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id='split-button-menu' autoFocusItem>
                                    {options.map((option) => (
                                        <MenuItem
                                            key={option.key}
                                            selected={value === option.key}
                                            disabled={isDisabledCurrentOption && value === option.key}
                                            onClick={() => handleMenuItemClick(option.key)}
                                        >
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Box>
    );
};
