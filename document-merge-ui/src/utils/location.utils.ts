import { PATH_KEYS, ROUTES } from '@data';

export const hashHasPath = (path: string): boolean => {
    const hash = window.location.hash;
    return hash.indexOf(path) !== -1;
};

export const isLoginPath = (): boolean => {
    return hashHasPath(ROUTES.LOGIN.path);
};

export const getHashBySymbolPosition = (position = 0): string => {
    const hash = window.location.hash;
    if (position > 0) {
        return getHashDestination(hash, position);
    }
    const splitPosition = hash.lastIndexOf('?');
    if (splitPosition === -1) {
        return '';
    }
    return hash.slice(splitPosition);
};

const getHashDestination = (hash: string, position: number): string => {
    const splitPosition = hash.lastIndexOf('?');
    if (splitPosition === -1) {
        return hash.slice(position);
    }
    return hash.slice(position, splitPosition);
};

export const editHostId = (params: URLSearchParams, hostId: string): URLSearchParams => {
    if (params.has(PATH_KEYS.HOST_ID)) {
        params.delete(PATH_KEYS.HOST_ID);
        params.set(PATH_KEYS.HOST_ID, hostId);
    }
    return params;
};

export const getNextUrl = (location, defaultUrl: string, hostId?: string | number): string => {
    const params = new URLSearchParams(location.search);
    if (params.has(PATH_KEYS.DESTINATION)) {
        const nextUrl = `${params.get(PATH_KEYS.DESTINATION)}`;
        params.delete(PATH_KEYS.DESTINATION);
        const convertedParamsToString = editHostId(params, hostId as string).toString();
        return convertedParamsToString ? `${nextUrl}?${convertedParamsToString}` : nextUrl;
    }
    return defaultUrl;
};

export const parseQueryParameterId = (key: string, params: URLSearchParams) => {
    return params.get(key) ? Number.parseInt(params.get(key), 10) : null;
};

export const getActiveHostId = (): number => {
    const params = new URLSearchParams(getHashBySymbolPosition());
    return parseQueryParameterId(PATH_KEYS.HOST_ID, params);
};
