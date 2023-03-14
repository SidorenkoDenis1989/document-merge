import '@resources/sass/global.sass';
import '@config';
import React from 'react';
import ReactDOM from 'react-dom';
import { NDMMain } from '@component';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

i18next.init({
    interpolation: { escapeValue: false }, // React already does escaping
    resources: {},
});

ReactDOM.render(
    <I18nextProvider i18n={i18next}>
        <NDMMain />
    </I18nextProvider>,
    document.getElementById('UIRoot')
);
