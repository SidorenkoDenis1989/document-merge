export class Route<T extends (...args) => string = () => string> {
    constructor(public path: string, public build: T = (() => '') as T) {}
}

export const homePagePath = '/';
export const settingsPagePath = '/settings';
export const preferencesPagePath = '/preferences';
export const documentationPagePath = '/documentation';
export const licensePagePath = `/license`;
export const loginPagePath = '/login';
export const mergingPagePath = '/merging';

export const ROUTES = {
    HOME: new Route(homePagePath, () => homePagePath),
    SETTINGS: new Route(settingsPagePath, () => settingsPagePath),
    PREFERENCES: new Route(preferencesPagePath, () => preferencesPagePath),
    DOCUMENTATION: new Route(documentationPagePath, () => documentationPagePath),
    LOGIN: new Route(loginPagePath, () => loginPagePath),
    LICENSE_SETTINGS: new Route(licensePagePath, () => licensePagePath),
    MERGING: new Route(mergingPagePath, () => mergingPagePath),
};

export const LOGO_PATH = window.location.protocol + '//' + window.location.host + '/public/resource/icon/application';

export const PATH_KEYS = {
    HOST_ID: 'hostId',
    DESTINATION: 'destination',
};
