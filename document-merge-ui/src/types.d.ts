import { Container } from 'inversify';

declare global {
    const DIContainer: Container;
}

declare module '@mui/material/styles' {
    interface Theme {
        nanga?: {
            boxBackground: string;
            getLeftPositionRelativeSidebar: (isVisibleSidebar: boolean) => number;
            getMergeViewFormHeight: (isOpenedFrom: boolean) => number;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        nanga?: {
            boxBackground: string;
            getLeftPositionRelativeSidebar: (isVisibleSidebar: boolean) => number;
            getMergeViewFormHeight: (isOpenedFrom: boolean) => number;
        };
    }
}
