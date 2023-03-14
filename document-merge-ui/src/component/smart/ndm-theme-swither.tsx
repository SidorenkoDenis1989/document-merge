import React from 'react';
import { Option, TYPES } from '@data';
import { LocalStorageService } from '@service';
import { AvailableThemes } from '@theme';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer/root.reducer';
import { useTranslation } from 'react-i18next';
import { SplitButtonSelect } from '@component/simple/buttons/split-button-select';

export const NDMThemeSwitcher = () => {
    const localStorageService = DIContainer.get<LocalStorageService>(TYPES.LOCAL_STORAGE_SERVICE);
    const appThemeName = useSelector<RootState, string>((state) => state.ApplicationInfoScope.appTheme);
    const [t] = useTranslation('translation');
    const handleClick = (value) => localStorageService.setAppThemeType(value);

    const options: Option[] = [
        {
            key: AvailableThemes.DARK,
            name: t('dark'),
        },
        {
            key: AvailableThemes.LIGHT,
            name: t('light'),
        },
    ];

    return (
        <SplitButtonSelect onChange={(event) => handleClick(event)} value={appThemeName || localStorageService.getAppThemeType()} options={options} fullWidth />
    );
};
