import { COLORS } from '@theme';
import { createTheme } from '@mui/material';
import { SIZE_PX } from '@data/constant/size.constant';

export enum AvailableThemes {
    LIGHT = 'light',
    DARK = 'dark',
}

const getLeftPositionRelativeSidebar = (isVisibleSidebar: boolean): number =>
    (isVisibleSidebar ? SIZE_PX.sidebar.maxWidth : SIZE_PX.sidebar.minWidth) + SIZE_PX.pageLayout.padding;

const getMergeViewFormHeight = (isOpenedForm: boolean): number => (isOpenedForm ? SIZE_PX.mergeViewForm.maxHeight : SIZE_PX.mergeViewForm.minHeight);

export const APP_THEME_LIGHT = createTheme({
    nanga: {
        boxBackground: COLORS.grey,
        getLeftPositionRelativeSidebar,
        getMergeViewFormHeight,
    },
    palette: {
        mode: 'light',
        primary: {
            main: COLORS.nangaRed,
        },
        secondary: {
            main: COLORS.black,
        },
        info: {
            main: COLORS.grey,
        },
        text: {
            primary: COLORS.black,
            secondary: COLORS.nangaRed,
        },
        action: {
            active: COLORS.darkGrey,
            hover: COLORS.nangaRedHover,
        },
        background: {
            default: COLORS.white,
        },
    },
    spacing: 8,
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: COLORS.nangaRed,
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                underline: {
                    '&:before': {
                        borderBottomColor: COLORS.nangaRed + ' !important',
                    },
                    '&:after': {
                        borderBottomColor: COLORS.nangaRed + ' !important',
                    },
                    '&:hover:before': {
                        borderBottomColor: COLORS.nangaRed + ' !important',
                    },
                    '&.MuiInputBase-colorSecondary': {
                        '&:before': {
                            borderBottomColor: COLORS.black + ' !important',
                        },
                        '&:after': {
                            borderBottomColor: COLORS.black + ' !important',
                        },
                        '&:hover:before': {
                            borderBottomColor: COLORS.black + ' !important',
                        },
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    '&:-webkit-autofill': {
                        transition: 'background-color 5000s ease-in-out 0s',
                    },
                },
            },
        },
        MuiFilledInput: {
            styleOverrides: {
                underline: {
                    '&:before': {
                        borderBottomColor: COLORS.nangaRed + ' !important',
                    },
                    '&:hover:before': {
                        borderBottomColor: COLORS.nangaRed + ' !important',
                    },
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                contained: {
                    color: COLORS.black,
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                shrink: {
                    '&.MuiInputLabel-filled': {
                        position: 'absolute',
                        transform: 'translate(12px, 8px) scale(1) !important',
                    },
                    '&.MuiInputLabel-standard': {
                        position: 'absolute',
                    },
                    '&.MuiInputLabel-outlined': {
                        color: COLORS.darkGrey,
                        transform: 'translate(14px, -2px) scale(1) !important',
                    },
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                colorSecondary: {
                    color: COLORS.black,
                },
            },
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    color: COLORS.darkGrey,
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: COLORS.darkGrey,
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                arrow: {
                    color: COLORS.black,
                },
                tooltip: {
                    background: COLORS.black,
                },
            },
        },
    },
});

export const APP_THEME_DARK = createTheme({
    nanga: {
        boxBackground: COLORS.darkGrey,
        getLeftPositionRelativeSidebar,
        getMergeViewFormHeight,
    },
    palette: {
        mode: 'dark',
        primary: {
            main: COLORS.nangaRed,
        },
        secondary: {
            main: COLORS.lightGrey,
        },
        info: {
            main: COLORS.grey,
        },
        text: {
            primary: COLORS.white,
            secondary: COLORS.nangaRed,
        },
        action: {
            active: COLORS.lightGrey,
            hover: COLORS.nangaRedHover,
        },
        background: {
            default: COLORS.black,
            paper: COLORS.darkGrey,
        },
    },
    spacing: 8,
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: COLORS.nangaRed,
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                underline: {
                    '&:before': {
                        borderBottomColor: COLORS.nangaRed + ' !important',
                    },
                    '&:hover:before': {
                        borderBottomColor: COLORS.nangaRed + ' !important',
                    },
                    '&.MuiInputBase-colorSecondary': {
                        '&:before': {
                            borderBottomColor: COLORS.white + ' !important',
                        },
                        '&:after': {
                            borderBottomColor: COLORS.white + ' !important',
                        },
                        '&:hover:before': {
                            borderBottomColor: COLORS.white + ' !important',
                        },
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    '&:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 30px ' + COLORS.inputAutofillDark + ' inset !important',
                        transition: 'background-color 5000s ease-in-out 0s',
                    },
                },
            },
        },
        MuiFilledInput: {
            styleOverrides: {
                underline: {
                    '&:before': {
                        borderBottom: '1px solid' + COLORS.nangaRed + ' !important',
                    },
                    '&:hover:before': {
                        borderBottom: '1px solid' + COLORS.nangaRed + ' !important',
                    },
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                contained: {
                    color: COLORS.lightGrey,
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                shrink: {
                    '&.MuiInputLabel-filled': {
                        position: 'absolute',
                        transform: 'translate(12px, 8px) scale(1) !important',
                    },
                    '&.MuiInputLabel-standard': {
                        position: 'absolute',
                    },
                    '&.MuiInputLabel-outlined': {
                        color: COLORS.lightGrey,
                        transform: 'translate(14px, -2px) scale(1) !important',
                    },
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                colorSecondary: {
                    color: COLORS.lightGrey,
                },
            },
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    color: COLORS.lightGrey,
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: COLORS.lightGrey,
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                arrow: {
                    color: COLORS.black,
                },
                tooltip: {
                    background: COLORS.black,
                },
            },
        },
    },
});
