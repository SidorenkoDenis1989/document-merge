import React from 'react';
import { Box, Container } from '@mui/material';
// TODO: Add Loader's image for dark theme when we will get it
// @ts-ignore
import LoaderImgLightTheme from '@resources/img/black-loader.gif';
// @ts-ignore
import LoaderImgBlackTheme from '@resources/img/white-loader.gif';
import { useTranslation } from 'react-i18next';
import { LocalStorageService } from '@service';
import { TYPES } from '@data';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer';

export const NDMLoaderPage: React.FC = () => {
    const localStorageService = DIContainer.get<LocalStorageService>(TYPES.LOCAL_STORAGE_SERVICE);
    const [t] = useTranslation('translation');
    useSelector<RootState, string>((state) => state.ApplicationInfoScope.appTheme);

    return (
        <Container
            disableGutters
            maxWidth={false}
            sx={(theme) => ({
                bgcolor: theme.palette.background.default,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                left: '0',
                top: '0',
                right: '0',
                bottom: '0',
                zIndex: '1098',
            })}
        >
            <Box
                component='img'
                sx={() => ({
                    maxHeight: '500px',
                    content: `url(${localStorageService.isLightTheme() ? LoaderImgLightTheme : LoaderImgBlackTheme})`,
                })}
                alt={t('loadingText')}
            />
        </Container>
    );
};
