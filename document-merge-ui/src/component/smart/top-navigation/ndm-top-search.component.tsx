import * as React from 'react';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FilterService } from '@service/filter-service';
import { TYPES } from '@data/constant/types.constant';
import { debounce } from '@utils';
import CloseIcon from '@mui/icons-material/Close';

const STORE_UPDATE_DELAY_MS = 1000;
export const NDMTopSearch: React.FC = () => {
    const filterService = DIContainer.get<FilterService>(TYPES.FILTER_SERVICE);

    const [t] = useTranslation('translation');
    const [value, setValue] = React.useState<string>(filterService.getSearchStr());

    React.useEffect(() => {
        return () => filterService.setSearchStr('');
    }, []);

    const updateValueInStore = React.useMemo<(value: string) => void>(() => {
        return debounce((newValue) => filterService.setSearchStr(newValue), STORE_UPDATE_DELAY_MS);
    }, []);

    const updateValue = (newValue: string) => {
        setValue(newValue);
        updateValueInStore(newValue);
    };

    const cleanValue = () => {
        setValue('');
        filterService.setSearchStr('');
    };

    return (
        <FormControl size={'small'} sx={{ marginBottom: '8px' }}>
            <InputLabel variant={'outlined'} htmlFor='search'>
                {t('search')}
            </InputLabel>
            <OutlinedInput
                id={'search'}
                size='small'
                label={t('search')}
                endAdornment={
                    <InputAdornment position='end'>
                        <IconButton onClick={cleanValue}>
                            <CloseIcon fontSize={'small'} />
                        </IconButton>
                    </InputAdornment>
                }
                onChange={(event) => updateValue(event.target.value)}
                value={value}
            />
        </FormControl>
    );
};
