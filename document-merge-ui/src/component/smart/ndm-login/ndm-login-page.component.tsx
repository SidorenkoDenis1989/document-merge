import * as React from 'react';
import { NDMLoginForm, ContainerContent } from '@component';

export const NDMLoginPage: React.FC = () => {
    return (
        <ContainerContent maxWidth={480}>
            <NDMLoginForm />
        </ContainerContent>
    );
};
