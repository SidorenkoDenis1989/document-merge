import React from 'react';
import { ContainerContent, DialogContext, NDMLoaderPage } from '@component';
import { Button, Grid, Typography, Box, Dialog } from '@mui/material';
import NangaLogo from '@resources/img//nanga-logo.svg';
import { COLORS } from '@theme';
import CloseIcon from '@mui/icons-material/Close';
import { ApplicationInfoService, DialogService } from '@service';
import { TYPES } from '@data';
import { useWrapperLoading } from '@utils';
import { useTranslation } from 'react-i18next';

const LOGGING_ABOUT = 'about';
export const NDMAbout: React.FC = () => {
    const applicationInfoService = DIContainer.get<ApplicationInfoService>(TYPES.APPLICATION_INFO_SERVICE);
    const dialogService = DIContainer.get<DialogService>(TYPES.DIALOG_SERVICE);
    const dialogContext = React.useContext<DialogContext>(DialogContext);
    const [t] = useTranslation('translation');

    const { isLoading, wrapperLoading } = useWrapperLoading();

    const [currentVersion, setCurrentVersion] = React.useState<string>('');

    React.useMemo(() => {
        wrapperLoading(LOGGING_ABOUT, () => applicationInfoService.getProjectVersion().then(setCurrentVersion));
    }, []);

    if (isLoading(LOGGING_ABOUT)) {
        return <NDMLoaderPage />;
    }

    const handleClick = () => dialogService.hide(dialogContext);

    return (
        <Dialog open>
            <ContainerContent maxWidth={494}>
                <Grid container spacing={3}>
                    <Grid item md={12}>
                        <Typography variant={'h5'}>Nanga Document Merge</Typography>
                        <Button
                            variant={'text'}
                            color={'secondary'}
                            style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                            }}
                            onClick={handleClick}
                        >
                            <CloseIcon />
                        </Button>
                    </Grid>
                    <Grid item container md={8} alignItems={'stretch'}>
                        <Box mb={7}>
                            <Typography mb={2}>Version {currentVersion}</Typography>
                            <Typography mb={2}>Copyright NANGA SYSTEMS GmbH {new Date().getFullYear()}</Typography>
                            <Typography>Implemented by NANGA SYSTEMS GmbH</Typography>
                        </Box>
                        <Box display={'flex'} justifyContent={'flex-end'} width={'100%'}>
                            <Button fullWidth variant='contained' onClick={handleClick}>
                                {t('ok')}
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item md={4}>
                        <Box
                            bgcolor={COLORS.white}
                            alignItems={'center'}
                            justifyContent={'center'}
                            display={'flex'}
                            borderRadius={1}
                            padding={2}
                            height={'100%'}
                        >
                            <img src={NangaLogo} />
                        </Box>
                    </Grid>
                </Grid>
            </ContainerContent>
        </Dialog>
    );
};
