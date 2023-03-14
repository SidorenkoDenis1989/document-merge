import '@resources/sass/component/ndm-license.component.sass';
import * as React from 'react';
import { LicenseService } from '@service';
import { NangaLicenseDto, TYPES } from '@data';
import { SaveButton, NDMLoaderPage, ContainerContent } from '@component';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { showErrorMessage, showSaveMessage, useWrapperLoading } from '@utils';
import { useTranslation } from 'react-i18next';

const LOGGING_LICENSE = 'license';
export const NDMLicense: React.FC = () => {
    const licenseService = DIContainer.get<LicenseService>(TYPES.LICENSE_SERVICE);

    const [licenseDto, setLicenseDto] = React.useState<NangaLicenseDto>();
    const [licenseKey, setLicenseKey] = React.useState<string>();
    const { isLoading, wrapperLoading } = useWrapperLoading();
    const [t] = useTranslation('translation');

    const setLicenseUI = (dto: NangaLicenseDto) => {
        setLicenseDto(dto);
        setLicenseKey(dto.licenseKey || '');
    };

    React.useEffect(() => {
        wrapperLoading(LOGGING_LICENSE, () => licenseService.getLicense().then(setLicenseUI).catch(showErrorMessage));
    }, []);

    if (isLoading(LOGGING_LICENSE) || !licenseDto) {
        return <NDMLoaderPage />;
    }

    const getExpirationDate = (expirationDate: string) => {
        const dateArr = expirationDate.split('-');
        const year = Number.parseInt(dateArr[0], 10);
        const maxYear = 10000;
        if (year > maxYear) {
            return 'Not expiring';
        }
        return `${expirationDate} at 00 o'clock`;
    };

    const pasteLicenseKey = async () => {
        const licenseKey = await navigator.clipboard.readText();
        setLicenseKey(licenseKey);
    };

    return (
        <ContainerContent className={'license'} maxWidth={630}>
            <Grid container item columnSpacing={1.25}>
                <Grid item xs={12} className='license__title'>
                    <Box mb={3}>
                        <Typography variant={'h5'} color={'textPrimary'}>
                            {t('licensing')}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item md={6} xs={12} className='license__status'>
                    <Box mb={3}>
                        <TextField
                            fullWidth
                            size='small'
                            id='license__status'
                            label={t('licenseStatus')}
                            defaultValue={licenseDto.valid ? t('valid') : t('invalid')}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} xs={12} className='license__expiration-date'>
                    <Box mb={3}>
                        <TextField
                            fullWidth
                            size='small'
                            id='license__expiration-date'
                            label={t('licenseExpirationDate')}
                            defaultValue={licenseDto.expirationDate ? getExpirationDate(licenseDto.expirationDate) : '-'}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} xs={12} className='license__company-name'>
                    <Box mb={3}>
                        <TextField
                            fullWidth
                            size='small'
                            id='license__company-name'
                            label={t('licenseCompanyName')}
                            defaultValue={licenseDto.companyName ? `${licenseDto.companyName}` : '-'}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} xs={12} className='license__volume'>
                    <Box mb={3}>
                        <TextField
                            fullWidth
                            size='small'
                            id='license__volume'
                            label={t('licenseVolume')}
                            defaultValue={licenseDto.volume ? `${licenseDto.volume}` : '-'}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} className='license__email'>
                    <Box mb={3}>
                        <TextField
                            fullWidth
                            size='small'
                            id='license__email'
                            label={t('email')}
                            defaultValue={licenseDto.emailAddress ? `${licenseDto.emailAddress}` : '-'}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Box>
                </Grid>
                <Grid container item xs={12} spacing={1.25}>
                    <Grid item xs={10} className={'license__code'}>
                        <TextField
                            multiline
                            rows={5}
                            variant={'filled'}
                            label={t('licenseCode')}
                            fullWidth
                            onChange={(evt) => setLicenseKey(evt.target.value)}
                            value={licenseKey}
                            helperText={t('licensePlaceholder')}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button fullWidth variant='contained' onClick={pasteLicenseKey}>
                            {t('paste')}
                        </Button>
                    </Grid>
                    <Box pl={1.25} mt={3}>
                        <SaveButton
                            isDisabled={isLoading(LOGGING_LICENSE) || !licenseKey}
                            label={t('ok')}
                            onClick={() =>
                                wrapperLoading(LOGGING_LICENSE, () =>
                                    licenseService
                                        .setLicense(licenseKey)
                                        .then((licenseDto) => {
                                            setLicenseDto(licenseDto);
                                            showSaveMessage();
                                        })
                                        .catch(showErrorMessage)
                                )
                            }
                        />
                        <Button variant='contained' sx={{ marginLeft: 1.25 }}>
                            {t('cancel')}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </ContainerContent>
    );
};
