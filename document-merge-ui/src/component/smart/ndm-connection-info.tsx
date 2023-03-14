import { Box, TextField, Typography } from '@mui/material';
import React from 'react';
import { useHost, useWrapperLoading } from '@utils';
import { TYPES } from '@data';
import { useTranslation } from 'react-i18next';
import { SessionService } from '@service';

const LOADING_USER_INFO = 'userInfo';
export const NDMConnectionInfo: React.FC = () => {
    const sessionService = DIContainer.get<SessionService>(TYPES.SESSION_SERVICE);
    const [currentUserName, setCurrentUserName] = React.useState<string>('');
    const [t] = useTranslation('translation');
    const { wrapperLoading } = useWrapperLoading();
    const host = useHost();

    React.useEffect(() => {
        wrapperLoading(LOADING_USER_INFO, () => sessionService.getCurrentUserInfo().then((userInfo) => setCurrentUserName(userInfo.userName)));
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant='subtitle2'>{t('connection')}</Typography>
            <Box sx={{ width: '100%' }} mt={1.25}>
                <TextField
                    color={'secondary'}
                    fullWidth
                    label={t('server')}
                    variant='standard'
                    value={host ? host.host : ''}
                    inputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            <Box sx={{ width: '100%' }} mt={1.25}>
                <TextField
                    color={'secondary'}
                    fullWidth
                    label={t('user')}
                    variant='standard'
                    value={currentUserName}
                    inputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
        </Box>
    );
};
