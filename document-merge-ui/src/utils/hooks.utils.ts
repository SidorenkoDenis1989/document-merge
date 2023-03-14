import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getActiveHostId, parseQueryParameterId, showErrorMessage } from '@utils';
import { ILMConfiguration, PATH_KEYS, DisplayError } from '@data';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer';

type asyncFunction = () => Promise<any>;
type getBoolean = (key: string) => boolean;
type FunctionKeys = { [key: string]: boolean };
type returnParams = { isLoading: getBoolean; isError: getBoolean; wrapperLoading: (key: string, func: asyncFunction) => void };

export const useWrapperLoading = (): returnParams => {
    const [loadingKeys, setLoadingKeys] = React.useState<FunctionKeys>({});
    const [errorKeys, setErrorKeys] = React.useState<FunctionKeys>({});

    const updateKey = (key: string, value: boolean) => (obj: FunctionKeys) => ({ ...obj, [key]: value });

    const wrapperLoading = React.useMemo(
        () => async (key: string, func) => {
            setLoadingKeys(updateKey(key, true));
            setErrorKeys(updateKey(key, false));
            try {
                await func();
            } catch (e) {
                if (e instanceof DisplayError) {
                    showErrorMessage(e.message);
                }
                console.error(e);
                setErrorKeys(updateKey(key, true));
            } finally {
                setLoadingKeys(updateKey(key, false));
            }
        },
        []
    );

    const isLoading: getBoolean = React.useMemo<getBoolean>(() => {
        return (key) => !!loadingKeys[key];
    }, [loadingKeys]);

    const isError: getBoolean = React.useMemo<getBoolean>(() => {
        return (key) => !!errorKeys[key];
    }, [loadingKeys]);

    return {
        isLoading,
        isError,
        wrapperLoading,
    };
};

export const useHost = (): ILMConfiguration => {
    const hosts = useSelector<RootState, ILMConfiguration[]>((state) => state.ApplicationInfoScope.hosts || []);
    const [host, setHost] = React.useState<ILMConfiguration>(null);

    React.useEffect(() => {
        if (!hosts.length) {
            setHost(null);
            return;
        }
        const hostId = getActiveHostId();
        const currentHost = hosts.find((host) => host.id === hostId);
        setHost(currentHost);
    }, [hosts]);

    return host;
};

export const useHostId = (): [number] => {
    const parseHostId = () => {
        const params = new URLSearchParams(location.search);
        return parseQueryParameterId(PATH_KEYS.HOST_ID, params);
    };

    const location = useLocation();
    const [hostId, setHostId] = React.useState<number>(parseHostId());

    React.useEffect(() => {
        setHostId(parseHostId());
    }, [location.search]);

    return [hostId];
};

export const useFocus = <T extends HTMLElement>(): [React.MutableRefObject<T>, () => void] => {
    const htmlElRef = React.useRef<T>(null);
    const setFocus = () => {
        if (htmlElRef.current) {
            htmlElRef.current.focus();
        }
    };

    return [htmlElRef, setFocus];
};

export const useHistoryPushWithSearch = (): { historyPush: (path: string) => void } => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = location.search || '';
    const historyPush = (path: string) => navigate(path + queryParams);
    return { historyPush };
};

export const useIsPage = (url: string): boolean => {
    const location = useLocation().pathname;
    return location.startsWith(url);
};
