import '@resources/sass/component/ndm-login-form.component.sass';
import React from 'react';
import { NDMLoaderPage } from '@component';
import { TYPES, ROUTES, ILMConfiguration } from '@data';
import { ApplicationInfoService, SessionService } from '@service';
import { useTranslation } from 'react-i18next';
import { getNextUrl, useWrapperLoading, showErrorMessage } from '@utils';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate, useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Box, Button, FilledInput, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography, Grid } from '@mui/material';

export interface NABLoginForm {
    username: string;
    password: string;
    hostId?: string | number;
}

enum LOADING {
    LOGIN = 'login',
    HOSTS = 'hosts',
}
export const NDMLoginForm = () => {
    const authenticationService = DIContainer.get<SessionService>(TYPES.SESSION_SERVICE);
    const hosts = useSelector<RootState, ILMConfiguration[]>((state) => state.ApplicationInfoScope.hosts || []);

    const location = useLocation();
    const navigate = useNavigate();

    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [hostId, setHostId] = React.useState<string | number>('');
    const [isShowPassword, setIsShowPassword] = React.useState<boolean>(false);

    const { isLoading, wrapperLoading } = useWrapperLoading();

    const [t] = useTranslation('translation');

    React.useEffect(() => {
        if (!hosts.length) {
            return;
        }
        const defaultHost = hosts[0];
        if (defaultHost) {
            setHostId(defaultHost.id);
        }
    }, [hosts]);

    const submitForm = (loginData: NABLoginForm) => {
        wrapperLoading(LOADING.LOGIN, () =>
            authenticationService
                .login(loginData.username, loginData.password, loginData.hostId)
                .then(() => navigate(getNextUrl(location, ROUTES.MERGING.path + `?hostId=${hostId}`, hostId)))
                .catch((err: AxiosError<any>) => showErrorMessage(err.response ? err.response.data.message : err))
        );
    };

    const getLabel = ({ host, label, port }: ILMConfiguration) => label || `${host}:${port}`;

    const loadingHostItem = (
        <MenuItem value={null} key={t('loadingText')}>
            {t('loadingText')}
        </MenuItem>
    );

    const hostItems = hosts.map((host) => (
        <MenuItem value={host.id} key={host.id}>
            {getLabel(host)}
        </MenuItem>
    ));

    const isNoSubmit = !username || !password;
    const onSubmit = (event) => {
        event.preventDefault();
        if (isNoSubmit) {
            return;
        }
        const loginData = {
            username: username,
            password: password,
            hostId: hostId,
        };
        submitForm(loginData);
    };

    return (
        <Grid justifyContent={'center'} width={'100%'}>
            {isLoading(LOADING.LOGIN) && <NDMLoaderPage />}
            <form autoComplete='off' onSubmit={onSubmit} noValidate className={'login-form'}>
                <Box mb={3}>
                    <Typography variant={'h5'} color={'textPrimary'}>
                        {t('login')}
                    </Typography>
                </Box>
                <Box mb={2}>
                    <TextField
                        fullWidth
                        id='username'
                        label={t('username')}
                        variant={'filled'}
                        onChange={(evt) => setUsername(evt.target.value.trim())}
                        value={username}
                    />
                </Box>
                <FormControl fullWidth variant='filled' sx={{ mb: 2 }}>
                    <InputLabel htmlFor='password'>{t('password')}</InputLabel>
                    <FilledInput
                        fullWidth
                        id='password'
                        type={isShowPassword ? null : t('password')}
                        onChange={(evt) => setPassword(evt.target.value.trim())}
                        value={password}
                        endAdornment={
                            <InputAdornment position='end' sx={{ mr: 0.5 }}>
                                <IconButton
                                    aria-label='toggle password visibility'
                                    onClick={() => {
                                        setIsShowPassword((isShowPassword) => !isShowPassword);
                                    }}
                                    edge='end'
                                >
                                    {isShowPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <FormControl fullWidth variant='filled' sx={{ mb: 3 }}>
                    <InputLabel id='integrity-host-select-label'>{t('integrityHostTitle')}</InputLabel>
                    <Select
                        id='integrity-host-select'
                        labelId='integrity-host-select-label'
                        onChange={(evt) => setHostId(evt.target.value as string)}
                        value={hostId}
                    >
                        {isLoading(LOADING.HOSTS) ? loadingHostItem : hostItems}
                    </Select>
                </FormControl>
                <Button fullWidth disabled={isNoSubmit || isLoading(LOADING.LOGIN)} type={'submit'} variant={'contained'} color={'primary'} size={'large'}>
                    {t('login')}
                </Button>
            </form>
        </Grid>
    );
};
