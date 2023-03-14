import { inject, injectable } from 'inversify';
import { APP_THEME_DARK, APP_THEME_LIGHT, AvailableThemes } from '@theme';
import { TYPES } from '@data';
import { ApplicationInfoScope } from '@scope';
import { ThemeOptions } from '@mui/material';

export interface LocalStorageService {
    getSiteLanguage(): string;
    setSiteLanguage(language: string): void;
    getAppThemeType(): AvailableThemes;
    setAppThemeType(isDarkTheme: AvailableThemes): void;
    getTheme(): ThemeOptions;
    isLightTheme(): boolean;
}

@injectable()
export class LocalStorageServiceImpl implements LocalStorageService {
    private readonly defaultLanguage = 'en';
    private readonly languageKey = 'lang';
    private readonly appThemeType = 'appThemeType';
    private readonly defaultThemeType = AvailableThemes.DARK;

    constructor(@inject(TYPES.APPLICATION_INFO_SCOPE) private applicationInfoScope: ApplicationInfoScope) {
        document.cookie = 'lang=' + this.getSiteLanguage();
    }

    getSiteLanguage(): string {
        return localStorage.getItem(this.languageKey) || this.defaultLanguage;
    }

    setSiteLanguage(language: string): void {
        localStorage.setItem(this.languageKey, language);
        document.cookie = 'lang=' + language;
    }

    getAppThemeType(): AvailableThemes {
        return (window.localStorage.getItem(this.appThemeType) as AvailableThemes) || this.defaultThemeType;
    }

    setAppThemeType(appThemeType: AvailableThemes) {
        localStorage.setItem(this.appThemeType, appThemeType);
        this.applicationInfoScope.appTheme = appThemeType;
    }

    getTheme(): ThemeOptions {
        const themeType = this.getAppThemeType();
        if (themeType === AvailableThemes.LIGHT) {
            return APP_THEME_LIGHT;
        }
        return APP_THEME_DARK;
    }

    isLightTheme(): boolean {
        return this.getTheme() === APP_THEME_LIGHT;
    }
}
