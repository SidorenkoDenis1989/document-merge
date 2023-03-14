import React from 'react';
import { TYPES, Option } from '@data';
import { LanguageService, LocalStorageService } from '@service';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer';
import { SplitButtonSelect } from '@component/simple/buttons/split-button-select';

export const NDMLanguageSwitcher = () => {
    const localStorageService = DIContainer.get<LocalStorageService>(TYPES.LOCAL_STORAGE_SERVICE);
    const languageService = DIContainer.get<LanguageService>(TYPES.LANGUAGE_SERVICE);
    const availableLanguages = useSelector<RootState, object>((state) => state.ApplicationInfoScope.availableLanguages);
    const [currentLanguage, setCurrentLanguage] = React.useState<Option>();
    const [items, setItems] = React.useState<Option[]>([]);
    const { i18n } = useTranslation('translation');

    React.useEffect(() => {
        if (!availableLanguages) {
            return;
        }
        processAvailableLanguages(availableLanguages);
    }, [availableLanguages]);

    const processAvailableLanguages = (data: object) => {
        const defaultSiteLang = localStorageService.getSiteLanguage();
        const items = [];
        Object.entries(data).forEach(([key, name]) => {
            const option = new Option(key, name);
            items.push(option);
            if (key === defaultSiteLang) {
                setCurrentLanguage(option);
            }
        });
        setItems(items);
    };

    const handleOption = (optionKey: string) => {
        if (!items.length) {
            return;
        }
        const option = items.find((item) => item.key === optionKey);
        setCurrentLanguage(option);
        localStorageService.setSiteLanguage(option.key);
        languageService.getDictionary(option.key).then((dict) => processDictionary(dict, option.key));
    };

    const processDictionary = (dict: object, lang: string) => {
        i18n.addResourceBundle(lang, 'translation', dict);
        i18n.changeLanguage(lang);
    };

    return <SplitButtonSelect onChange={(event) => handleOption(event)} value={currentLanguage && currentLanguage.key} options={items} fullWidth />;
};
