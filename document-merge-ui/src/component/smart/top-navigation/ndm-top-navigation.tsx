import * as React from 'react';
import { ReactNode } from 'react';
import { Autocomplete, AutocompleteRenderGetTagProps, Box, Button, Chip, Container, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material//SwapHoriz';
import { useTranslation } from 'react-i18next';
import { COLORS } from '@theme';
import { ApplicationInfoService, ComparedFieldsService, DialogService, FieldsDefinitionsService, FilterService, IntegrityService } from '@service';
import { Baseline, DifferenceOptions, FieldDefinition, MergeDocument, TYPES } from '@data';
import { getActiveHostId, useWrapperLoading } from '@utils';
import { BaselineAlertDialog, ConfirmationDialog, NDMLoaderPage } from '@component';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer/root.reducer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import { DateTimePicker } from '@mui/lab';
import DateFnsUtils from '@date-io/date-fns';

interface MergingInfo {
    primary: MergeDocument;
    secondary: MergeDocument;
    baselineSecondary: Baseline;
    baselinePrimary: Baseline;
    datePrimary: string;
    dateSecondary: string;
    comparisonFields: string[];
}

const emptyMergingInfo = {
    primary: null,
    baselinePrimary: null,
    secondary: null,
    baselineSecondary: null,
    datePrimary: null,
    dateSecondary: null,
    comparisonFields: [],
};

enum LOADING {
    BRANCHES = 'branches',
    DOCUMENTS = 'documents',
    FIELDS = 'fields',
    SECONDARY_BASELINES = 'secondaryBaselines',
    PRIMARY_BASELINES = 'primaryBaselines',
    INTEGRITY_ITEMS = 'integrityItems',
    MERGE_ALL = 'mergeAll',
}

export const NDMMergeTopBar: React.FC = () => {
    const dialogService = DIContainer.get<DialogService>(TYPES.DIALOG_SERVICE);
    const applicationService = DIContainer.get<ApplicationInfoService>(TYPES.APPLICATION_INFO_SERVICE);
    const integrityService = DIContainer.get<IntegrityService>(TYPES.INTEGRITY_SERVICE);
    const comparedFieldsService = DIContainer.get<ComparedFieldsService>(TYPES.COMPARED_FIELD_SERVICE);
    const fieldsDefinitionsService = DIContainer.get<FieldsDefinitionsService>(TYPES.FIELDS_DEFINITIONS_SERVICE);
    const filterService = DIContainer.get<FilterService>(TYPES.FILTER_SERVICE);

    const [t] = useTranslation('translation');

    const [documents, setDocuments] = React.useState<MergeDocument[]>([]);
    const [documentBranches, setDocumentsBranches] = React.useState<MergeDocument[]>([]);
    const [secondaryBaselines, setSecondaryBaselines] = React.useState<Baseline[]>([]);
    const [primaryBaselines, setPrimaryBaselines] = React.useState<Baseline[]>([]);
    const [documentFields, setDocumentFields] = React.useState<FieldDefinition[]>([]);
    const [mergingInfo, setMergingInfo] = React.useState<MergingInfo>(emptyMergingInfo);
    const isOpened = useSelector<RootState, boolean>((state) => state.MergeViewScope.isOpenMergeConditions);

    const DISPLAY_FIELDS_COUNT = 3;

    const { isLoading, wrapperLoading } = useWrapperLoading();

    React.useEffect(() => {
        wrapperLoading(LOADING.DOCUMENTS, () => applicationService.getDocuments().then(setDocuments));
    }, []);

    const processComparisonFields = async (value: MergeDocument) => {
        if (!value) {
            setComparisonFields(null, []);
            return Promise.resolve();
        }

        const documentFields = await comparedFieldsService.getFields(value.type, value.nodeType);
        const definitions = await fieldsDefinitionsService.getSortedDefinitionByFields(documentFields.allFields);
        const defaultDocumentComparedFields = documentFields.defaultCompareFields.filter((fieldName) => documentFields.allFields.includes(fieldName));
        setComparisonFields(value, defaultDocumentComparedFields);
        setDocumentFields(definitions);
        return Promise.resolve();
    };

    const setComparisonFields = (primary: MergeDocument, comparisonFields: string[]) => {
        setMergingInfo((mergingInfo) => {
            if (mergingInfo.primary === primary) {
                return {
                    ...mergingInfo,
                    primary: primary,
                    comparisonFields: comparisonFields,
                };
            }
            return mergingInfo;
        });
    };

    const processBranches = (value: MergeDocument) => {
        if (!value) {
            setDocumentsBranches([]);
            return Promise.resolve();
        }
        return applicationService.getDocumentBranches(value.id).then((documentBranches) => {
            setMergingInfo((mergingInfo) => {
                if (mergingInfo.primary === value) {
                    setDocumentsBranches([value, ...documentBranches]);
                }
                return mergingInfo;
            });
        });
    };

    const onChangePrimary = (primaryValue: MergeDocument, baselinePrimaryValue?: Baseline) => {
        setMergingInfo((mergingInfo) => ({
            ...mergingInfo,
            primary: primaryValue,
            comparisonFields: null,
            secondary: null,
            baselinePrimary: baselinePrimaryValue ? baselinePrimaryValue : null,
            baselineSecondary: null,
        }));
        setPrimaryBaselines([]);
        setSecondaryBaselines([]);
        setDocumentFields([]);
        wrapperLoading(LOADING.BRANCHES, () => processBranches(primaryValue));
        wrapperLoading(LOADING.FIELDS, () => processComparisonFields(primaryValue));
        if (primaryValue) {
            wrapperLoading(LOADING.PRIMARY_BASELINES, () => applicationService.getBaselines(primaryValue.id).then(setPrimaryBaselines));
        }
    };

    const onChangeSecondary = (value: MergeDocument) => {
        setMergingInfo((mergingInfo) => ({
            ...mergingInfo,
            secondary: value,
            baselineSecondary: null,
        }));
        setSecondaryBaselines([]);
        wrapperLoading(LOADING.SECONDARY_BASELINES, () => applicationService.getBaselines(value.id).then(setSecondaryBaselines));
    };

    const setMergeDocumentsValues = (key: string, value: MergeDocument | Baseline | string[] | string) => {
        setMergingInfo((oldMergingInfo) => {
            const newMergingInfoState = { ...oldMergingInfo };
            newMergingInfoState[key] = value;
            return newMergingInfoState;
        });
    };

    const differenceOptions: DifferenceOptions = {
        hostId: getActiveHostId(),
        primary: mergingInfo.primary,
        secondary: mergingInfo.secondary,
        labelSecondary: mergingInfo.baselineSecondary ? mergingInfo.baselineSecondary.label : null,
        labelPrimary: mergingInfo.baselinePrimary ? mergingInfo.baselinePrimary.label : null,
        datePrimary: mergingInfo.datePrimary,
        dateSecondary: mergingInfo.dateSecondary,
        comparedFields: mergingInfo.comparisonFields,
    };

    const getIntegrityItems = () => {
        filterService.setAvailableFields([]);
        wrapperLoading(LOADING.INTEGRITY_ITEMS, () =>
            integrityService.getIntegrityItems(differenceOptions, mergingInfo.baselineSecondary).then(() => {
                filterService.setAvailableFields(documentFields);
                filterService.setFilterDisabledState(false);
            })
        );
    };

    const isNotValidData = () => {
        return !(mergingInfo.primary && mergingInfo.secondary);
    };

    const getFieldsDefinitionsByFieldName = (comparisonFields: string[]): FieldDefinition[] => {
        if (!comparisonFields) {
            return [];
        }
        return documentFields.filter((fieldDefinition) => comparisonFields.includes(fieldDefinition.name));
    };

    const renderComparisonFieldsTags = (fieldsDefinitions: FieldDefinition[], props: AutocompleteRenderGetTagProps): ReactNode => {
        if (fieldsDefinitions.length <= DISPLAY_FIELDS_COUNT) {
            return fieldsDefinitions.map((tag, index) => <Chip {...props({ index })} label={tag.displayName} />);
        }

        const renderedFieldsTags = fieldsDefinitions.slice(0, DISPLAY_FIELDS_COUNT);
        const hiddenTagsCounter = fieldsDefinitions.length - DISPLAY_FIELDS_COUNT;
        const singleHiddenTagText = `+${hiddenTagsCounter} ${t('field')}`;
        const pluralHiddenTagsText = `+${hiddenTagsCounter} ${t('fields')}`;
        const hiddenTagsText = hiddenTagsCounter > 1 ? pluralHiddenTagsText : singleHiddenTagText;
        return (
            <>
                {renderedFieldsTags.map((tag, index) => (
                    <Chip {...props({ index })} label={tag.displayName} />
                ))}
                <Box pr={1}>{hiddenTagsText.toLowerCase()}</Box>
            </>
        );
    };
    const onRefresh = () => {
        filterService.removeAllFieldFilters();
        if (!mergingInfo.baselinePrimary && !mergingInfo.datePrimary) {
            return getIntegrityItems();
        }
        dialogService.show(<BaselineAlertDialog onAccept={getIntegrityItems} />);
    };

    const onMergeAll = () => {
        dialogService.show(
            <ConfirmationDialog
                title={t('mergeAllConfirmation')}
                message={t('mergeAllConfirmationDialogText')}
                onAccept={() => {
                    filterService.setAvailableFields([]);
                    wrapperLoading(LOADING.MERGE_ALL, () =>
                        integrityService.mergeAll(differenceOptions, mergingInfo.baselineSecondary).then(() => onRefresh())
                    );
                }}
            />
        );
    };

    const isDocumentsEquals = () => mergingInfo.primary === mergingInfo.secondary;
    const isLabelEquals = () =>
        mergingInfo.baselinePrimary === mergingInfo.baselineSecondary || mergingInfo.baselinePrimary?.label === mergingInfo.baselineSecondary?.label;
    const isDateEquals = () => mergingInfo.datePrimary === mergingInfo.dateSecondary;

    const isDisableReplace =
        !mergingInfo.primary || !mergingInfo.secondary || (mergingInfo.primary === mergingInfo.secondary && isLabelEquals() && isDateEquals());

    const onReplace = () => {
        if (isDocumentsEquals() && !isLabelEquals()) {
            return setMergingInfo((oldMergingInfo) => ({
                ...oldMergingInfo,
                baselinePrimary: oldMergingInfo.baselineSecondary,
                baselineSecondary: oldMergingInfo.baselinePrimary,
            }));
        }
        if (isDocumentsEquals() && !isDateEquals()) {
            return setMergingInfo((oldMergingInfo) => ({
                ...oldMergingInfo,
                datePrimary: oldMergingInfo.dateSecondary,
                dateSecondary: oldMergingInfo.datePrimary,
            }));
        }
        if (mergingInfo.secondary && mergingInfo.baselineSecondary) {
            setPrimaryBaselines(secondaryBaselines);
            return onChangePrimary(mergingInfo.secondary, mergingInfo.baselineSecondary);
        }
        onChangePrimary(mergingInfo.secondary);
    };

    return (
        <>
            {isLoading(LOADING.INTEGRITY_ITEMS) && <NDMLoaderPage />}
            <Container maxWidth={false} className={'top-navigation'} disableGutters>
                <Box p={2} mt={3.25} bgcolor={(theme) => theme.nanga.boxBackground} display={isOpened ? 'block' : 'none'}>
                    <Grid container>
                        <Grid container item lg={6}>
                            <Box display='flex' flexWrap='nowrap' alignItems='center' justifyContent='space-between' width='100%' pr={5}>
                                <Box width='100%'>
                                    <Autocomplete<MergeDocument>
                                        id={'merge-primary-document'}
                                        clearOnEscape
                                        loading={isLoading(LOADING.DOCUMENTS)}
                                        options={documents}
                                        value={mergingInfo.primary}
                                        getOptionLabel={(option: MergeDocument) => option.mergeDropdownTitle}
                                        renderInput={(params) => <TextField {...params} label={t('primary')} variant='standard' />}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        onChange={(evt, value: MergeDocument) => onChangePrimary(value)}
                                    />
                                    <Box mt={2} />
                                    <BaselineField
                                        id={'merge-primary-baseline'}
                                        isLoadingOptions={isLoading(LOADING.PRIMARY_BASELINES)}
                                        options={primaryBaselines}
                                        value={mergingInfo.baselinePrimary}
                                        date={mergingInfo.datePrimary}
                                        onChange={(value) => {
                                            setMergeDocumentsValues('datePrimary', null);
                                            setMergeDocumentsValues('baselinePrimary', value);
                                        }}
                                        onChangeDate={(date) => {
                                            setMergeDocumentsValues('baselinePrimary', null);
                                            setMergeDocumentsValues('datePrimary', date);
                                        }}
                                    />
                                </Box>
                                <Box ml={2} mr={2}>
                                    <IconButton onClick={onReplace} disabled={isDisableReplace}>
                                        <SwapHorizIcon htmlColor={isDisableReplace ? undefined : COLORS.nangaRed} />
                                    </IconButton>
                                </Box>
                                <Box width='100%'>
                                    <Autocomplete<MergeDocument>
                                        id={'merge-secondary-document'}
                                        clearOnEscape
                                        loading={isLoading(LOADING.BRANCHES)}
                                        options={documentBranches}
                                        value={mergingInfo.secondary}
                                        getOptionLabel={(option: MergeDocument) => option.mergeDropdownTitle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => <TextField {...params} label={t('secondary')} variant='standard' />}
                                        onChange={(evt, value: MergeDocument) => onChangeSecondary(value)}
                                    />
                                    <Box mt={2} />
                                    <BaselineField
                                        id={'merge-secondary-baseline'}
                                        isLoadingOptions={isLoading(LOADING.SECONDARY_BASELINES)}
                                        options={secondaryBaselines}
                                        date={mergingInfo.dateSecondary}
                                        value={mergingInfo.baselineSecondary}
                                        onChange={(value) => {
                                            setMergeDocumentsValues('dateSecondary', null);
                                            setMergeDocumentsValues('baselineSecondary', value);
                                        }}
                                        onChangeDate={(date) => {
                                            setMergeDocumentsValues('baselineSecondary', null);
                                            setMergeDocumentsValues('dateSecondary', date);
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid container item lg={6}>
                            <Box display='flex' flexWrap='nowrap' alignItems='flex-start' justifyContent='space-between' width='100%' pl={5}>
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    loading={isLoading(LOADING.FIELDS)}
                                    id={'comparison-fields'}
                                    options={documentFields}
                                    value={getFieldsDefinitionsByFieldName(mergingInfo.comparisonFields)}
                                    getOptionLabel={(option: FieldDefinition) => option.displayName}
                                    renderInput={(params) => (
                                        <TextField {...params} variant='standard' label={t('fieldsForComparison')} placeholder={t('field')} />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.name === value.name}
                                    onChange={(evt, values) => {
                                        setMergeDocumentsValues(
                                            'comparisonFields',
                                            (values as FieldDefinition[]).map((value) => value.name)
                                        );
                                    }}
                                    renderTags={(tagValue: FieldDefinition[], getTagProps) => renderComparisonFieldsTags(tagValue, getTagProps)}
                                />
                                <Box ml={10}>
                                    <Button
                                        type={'submit'}
                                        variant={'contained'}
                                        size={'large'}
                                        style={{ whiteSpace: 'nowrap' }}
                                        disabled={isNotValidData()}
                                        onClick={onRefresh}
                                    >
                                        {t('refresh')}
                                    </Button>
                                    <Button
                                        sx={{ marginTop: 3 }}
                                        type={'submit'}
                                        variant={'contained'}
                                        size={'large'}
                                        style={{ whiteSpace: 'nowrap' }}
                                        disabled={isNotValidData()}
                                        onClick={onMergeAll}
                                    >
                                        {t('mergeAllConfirmation')}
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
};

interface BaselineFieldProps {
    id: string;
    isLoadingOptions: boolean;
    options: Baseline[];
    value: Baseline;
    onChange: (baseline) => void;
    date: string;
    onChangeDate: (date: string) => void;
}

const dateFns = new DateFnsUtils();
const BaselineField: React.FC<BaselineFieldProps> = ({ onChangeDate, date, id, isLoadingOptions, options, value, onChange }) => {
    const dateFormat = useSelector<RootState, string>((state) => state.ApplicationInfoScope.dateFormat);
    const [isUseDate, setIsUseDate] = React.useState<boolean>(false);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const [t] = useTranslation('translation');

    React.useEffect(() => {
        //open calendar by click on toggle button
        if (isUseDate && !date) {
            setIsOpen(true);
            return;
        }
    }, [isUseDate]);

    React.useEffect(() => {
        //show datepicker on replacing(changed baseline list to date)
        if (date && !isUseDate) {
            setIsUseDate(true);
            return;
        }
        //hide datepicker on replacing(changed date to baseline list)
        if (!date && isUseDate) {
            setIsUseDate(false);
        }
    }, [date]);
    return (
        <Box display='flex' flexWrap='nowrap' alignItems='flex-end' justifyContent='space-between' width='100%'>
            {isUseDate && (isOpen || !!date) ? (
                <DateTimePicker
                    renderInput={({ inputProps, ...props }) => (
                        <TextField
                            {...props}
                            variant='standard'
                            inputProps={{
                                readOnly: true,
                                ...(inputProps || {}),
                            }}
                            InputProps={{
                                endAdornment: !date ? null : (
                                    <InputAdornment position='end'>
                                        <IconButton onClick={() => onChangeDate(null)} sx={{ padding: 0.5 }}>
                                            <CloseIcon fontSize={'small'} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: 'calc(100% - 40px)' }}
                        />
                    )}
                    value={date}
                    open={isOpen}
                    label={t('baselineDateLabel')}
                    disableFuture
                    maxDateTime={new Date()}
                    disableOpenPicker
                    inputFormat={dateFormat}
                    onAccept={() => setIsOpen(false)}
                    onClose={() => setIsOpen(false)}
                    onChange={(newValue: Date) => {
                        if (newValue) {
                            onChangeDate(dateFns.formatByString(newValue, dateFormat));
                        }
                    }}
                />
            ) : (
                <Autocomplete<Baseline>
                    id={id}
                    clearOnEscape
                    isOptionEqualToValue={(option, value) => option.label === value.label}
                    renderInput={(params) => <TextField {...params} label={t('baselineDateLabel')} variant='standard' />}
                    getOptionLabel={(option: Baseline) => option.label}
                    sx={{ width: 'calc(100% - 40px)' }}
                    loading={isLoadingOptions}
                    options={options}
                    value={value}
                    onChange={(evt, value: Baseline) => onChange(value)}
                />
            )}
            <IconButton
                color={isUseDate && (isOpen || !!date) ? 'primary' : 'secondary'}
                sx={{ width: 40 }}
                onClick={() => {
                    setIsUseDate(true);
                    setIsOpen(!isOpen);
                }}
                component='label'
            >
                <CalendarMonthIcon />
            </IconButton>
        </Box>
    );
};
