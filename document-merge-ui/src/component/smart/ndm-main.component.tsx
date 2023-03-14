import '@resources/sass/global.sass';
import * as React from 'react';
import { Provider, useSelector } from 'react-redux';
import { store } from '@store';
import { ThemeProvider } from '@theme';
import {
    DialogContainer,
    NDMDocumentationPage,
    NDMGuard,
    NDMLayout,
    NDMLicense,
    NDMLoaderPage,
    NDMLoginPage,
    NDMMergeViewPage,
    NDMPreferencesPage,
    NDMSettingsPage,
} from '@component';
import { ROUTES, TYPES } from '@data';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useTranslation } from 'react-i18next';
import { ApplicationInfoService, LanguageService, LocalStorageService } from '@service';
import { CssBaseline, ThemeOptions } from '@mui/material';
import { RootState } from '@reducer';

export const NDMMain: React.FC = () => {
    const isReady = useInitApplication();

    return (
        <Provider store={store}>
            <NDMThemeProvider>
                {!isReady ? (
                    <NDMLoaderPage />
                ) : (
                    <HashRouter>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DialogContainer>
                                <NDMLayout>
                                    <Routes>
                                        <Route path={ROUTES.HOME.path} element={<Navigate to={ROUTES.LOGIN.path} replace />} />
                                        <Route path={ROUTES.LOGIN.path} element={<NDMLoginPage />} />
                                        <Route path={ROUTES.SETTINGS.path} element={<NDMSettingsPage />} />
                                        <Route path={ROUTES.PREFERENCES.path} element={<NDMPreferencesPage />} />
                                        <Route path={ROUTES.DOCUMENTATION.path} element={<NDMDocumentationPage />} />
                                        <Route path={ROUTES.LICENSE_SETTINGS.path} element={<NDMLicense />} />
                                        <Route
                                            path={ROUTES.MERGING.path}
                                            element={
                                                <NDMGuard>
                                                    <NDMMergeViewPage />
                                                </NDMGuard>
                                            }
                                        />
                                    </Routes>
                                </NDMLayout>
                            </DialogContainer>
                        </LocalizationProvider>
                    </HashRouter>
                )}
            </NDMThemeProvider>
        </Provider>
    );
};

export interface NDMThemeProviderProps {
    children: React.ReactNode;
}

export const NDMThemeProvider: React.FC<NDMThemeProviderProps> = ({ children }) => {
    const localStorageService = DIContainer.get<LocalStorageService>(TYPES.LOCAL_STORAGE_SERVICE);
    const [appTheme, setAppTheme] = React.useState<ThemeOptions>(localStorageService.getTheme());
    const appThemeName = useSelector<RootState, string>((state) => state.ApplicationInfoScope.appTheme);

    React.useEffect(() => {
        const currentAppTheme = localStorageService.getTheme();
        setAppTheme(currentAppTheme);
    }, [appThemeName]);

    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

const useInitApplication = (): boolean => {
    const localStorageService = DIContainer.get<LocalStorageService>(TYPES.LOCAL_STORAGE_SERVICE);
    const [isReady, setIsReady] = React.useState<boolean>(false);
    const { i18n } = useTranslation();
    const languageService = DIContainer.get<LanguageService>(TYPES.LANGUAGE_SERVICE);
    const applicationInfoService = DIContainer.get<ApplicationInfoService>(TYPES.APPLICATION_INFO_SERVICE);

    const siteLanguage = localStorageService.getSiteLanguage();

    const processDictionary = (dict: object) => {
        i18n.addResourceBundle(siteLanguage, 'translation', dict);
        return i18n.changeLanguage(siteLanguage);
    };

    const initData = async () => {
        const requests = [
            applicationInfoService.getHosts(),
            applicationInfoService.getUISettings(),
            languageService.getAvailableLanguages(),
            languageService.getDictionary(siteLanguage).then(processDictionary),
        ];
        await Promise.all(requests).then(() => setIsReady(true));
    };
    React.useEffect(() => {
        initData();
    }, []);

    return isReady;
};
