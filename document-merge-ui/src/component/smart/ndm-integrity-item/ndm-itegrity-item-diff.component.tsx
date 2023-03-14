import React from 'react';
import { replaceEnterValue, DiffRichText } from '@utils';
import { styled } from '@mui/styles';
import { COLORS } from '@theme';

export interface NDMItegrityItemDiffComponentProps {
    oldValue: string;
    newValue: string;
    oldId: string;
    newId: string;
}

const DiffTextContainer = styled('div')({
    whiteSpace: 'pre-wrap',
    '& del': {
        background: COLORS.lightYellow,
        width: '10px',
        display: 'inline-block',
        verticalAlign: 'bottom',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        color: 'rgba(0, 0, 0, 0)',
        userSelect: 'none',
        '-webkit-touch-callout': 'none',
        '-webkit-user-select': 'none',
        '-khtml-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        '& p, h1, h2, h3, h4, h5, h6': {
            margin: 0,
        },
    },
    '& ins': {
        display: 'inline-block',
        background: COLORS.lightYellow,
        '& p, h1, h2, h3, h4, h5, h6': {
            margin: 0,
        },
        '&  del': {
            fontSize: 0,
        },
    },
});

export const NDMItegrityItemDiffComponent: React.FC<NDMItegrityItemDiffComponentProps> = ({ oldId, newId, oldValue, newValue }) => {
    const diffs = DiffRichText.getDiff(replaceEnterValue(oldValue, oldId), replaceEnterValue(newValue, newId));

    return <DiffTextContainer dangerouslySetInnerHTML={{ __html: diffs }} />;
};

export const NDMItegrityItemDiff = React.memo(NDMItegrityItemDiffComponent);
