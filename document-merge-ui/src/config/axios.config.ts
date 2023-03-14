import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ROUTES, DisplayError, licensePagePath } from '@data';
import { isLoginPath, getHashBySymbolPosition, getActiveHostId, showErrorMessage } from '@utils';

const config: AxiosRequestConfig = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
};

const handleUnauthorizedUser = () => {
    const isRequestFromLoginPage = isLoginPath();
    const params = getHashBySymbolPosition();
    const destination = getHashBySymbolPosition(1);
    if (isRequestFromLoginPage) {
        return (window.location.hash = `${destination}${params}`);
    }
    return (window.location.hash = `#${ROUTES.LOGIN.path}${params ? params + '&' : '?'}destination=${destination}`);
};

const parseMksError = (message = ''): { mksError: boolean; mksErrorMessage?: string } => {
    const matchError = message ? message.match(/MKS\d*:.*(\(command|\r)/) : null;
    if (!matchError) {
        return { mksError: false };
    }
    const error = matchError[0];
    return {
        mksError: true,
        mksErrorMessage: error.substring(error.indexOf(':') + 1, error.match(/\(command|\r/).index).trim(),
    };
};

const HTTP_INVALID_LICENSE_STATUS = 555;
export const ERROR_CODS = [401, 403];

const handleError = (error) => {
    if (ERROR_CODS.some((erroCode) => error.response.status === erroCode)) {
        handleUnauthorizedUser();
        return Promise.reject(error);
    }
    if (HTTP_INVALID_LICENSE_STATUS === error.response.status) {
        handleInvalidLicense(error.response.headers.errormessage);
        return Promise.reject(error);
    }
    const { error: apiError, message } = error.response.data;
    const { mksError, mksErrorMessage } = parseMksError(message || apiError);
    if (mksError) {
        return Promise.reject(new DisplayError(mksErrorMessage));
    }

    const alertMessage = 'Some error occurred:\n' + (apiError || '') + '\n' + (message || '');
    return Promise.reject(new DisplayError(alertMessage));
};

const handleInvalidLicense = (error: string) => {
    const hostId = getActiveHostId();
    showErrorMessage(error, `${licensePagePath}?hostId=${hostId}`);
};

const instance = axios.create(config);

instance.interceptors.response.use(
    (response) => response.data,
    (error) => handleError(error)
);

export const axiosApp: AxiosInstance = instance;
