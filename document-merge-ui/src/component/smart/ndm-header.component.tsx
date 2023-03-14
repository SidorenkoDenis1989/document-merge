import React from 'react';
import { AppBar, Box, Button, Drawer, IconButton, List, ListItem, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ApplicationInfoService, SessionService } from '@service';
import { LOGO_PATH, ROUTES, TYPES } from '@data';
import { NDMConnectionInfo, NDMLanguageSwitcher, NDMThemeSwitcher } from '@component';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import { getActiveHostId, showErrorMessage, useIsPage } from '@utils';
import { AxiosError } from 'axios';

const useHeaderStyles = makeStyles({
    header: {
        padding: '0 4px',
    },
    divider: {
        flexGrow: 1,
    },
    logo: {
        maxHeight: 48,
    },
});

export const NDMHeader: React.FC = () => {
    const appInfoService = DIContainer.get<ApplicationInfoService>(TYPES.APPLICATION_INFO_SERVICE);

    const openNavBar = () => {
        appInfoService.setIsVisibleNavBar(true);
    };

    const classes = useHeaderStyles();
    return (
        <AppBar position='fixed' className={classes.header}>
            <Toolbar disableGutters>
                <IconButton color='inherit' aria-label='menu' onClick={openNavBar}>
                    <MenuIcon />
                </IconButton>
                <div className={classes.divider} />
                <Typography>
                    <img className={classes.logo} src={LOGO_PATH} />
                </Typography>
                <div className={classes.divider} />
                <NDMHeaderMoreOptions />
            </Toolbar>
        </AppBar>
    );
};

const NDMHeaderMoreOptions: React.FC = () => {
    const authenticationService = DIContainer.get<SessionService>(TYPES.SESSION_SERVICE);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const isLoginPage = useIsPage(ROUTES.LOGIN.path);
    const [t] = useTranslation('translation');

    const handleLogout = () => {
        authenticationService
            .logout(getActiveHostId())
            .then(() => setIsOpen(false))
            .catch((err: AxiosError<any>) => showErrorMessage(err.response ? err.response.data.message : err));
    };

    return (
        <>
            <IconButton color='inherit' onClick={() => setIsOpen(true)}>
                <MoreVertIcon />
            </IconButton>
            <Drawer anchor='right' open={isOpen} onClose={() => setIsOpen(false)}>
                <List>
                    <ListItem divider={true} sx={{ flexWrap: 'wrap' }}>
                        <Typography variant='subtitle2'>{t('uiTheme')}</Typography>
                        <Box sx={{ width: '100%' }} px={2} mt={0.75}>
                            <NDMThemeSwitcher />
                        </Box>
                    </ListItem>
                    <ListItem divider={true} sx={{ flexWrap: 'wrap' }}>
                        <Typography variant='subtitle2'>{t('language')}</Typography>
                        <Box sx={{ width: '100%' }} px={2} mt={0.75}>
                            <NDMLanguageSwitcher />
                        </Box>
                    </ListItem>
                    {!isLoginPage && (
                        <ListItem divider={true}>
                            <NDMConnectionInfo />
                        </ListItem>
                    )}
                </List>
                <Button
                    startIcon={<LogoutIcon />}
                    variant={'contained'}
                    color={'primary'}
                    size={'large'}
                    onClick={handleLogout}
                    sx={{
                        position: 'absolute',
                        left: '10px',
                        right: '10px',
                        bottom: '12px',
                    }}
                >
                    {t('logout')}
                </Button>
            </Drawer>
        </>
    );
};
