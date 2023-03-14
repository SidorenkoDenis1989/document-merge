import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ArticleIcon from '@mui/icons-material/Article';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CodeIcon from '@mui/icons-material/Code';
import WebIcon from '@mui/icons-material/Web';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import { SIZE_PX, TYPES } from '@data';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer';
import { useTranslation } from 'react-i18next';
import { ExportService } from '@service/export.service';

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
    root: ({ isVisibleNavBar }) => ({
        position: 'fixed',
        bottom: SIZE_PX.differenceButtons.bottomPosition,
        left: theme.nanga.getLeftPositionRelativeSidebar(isVisibleNavBar),
    }),
}));

interface StyleProps {
    isVisibleNavBar: boolean;
}

export const NDMDifferenceExportButtons: React.FC = () => {
    const exportService = DIContainer.get<ExportService>(TYPES.EXPORT_SERVICE);
    const isVisibleNavBar = useSelector<RootState, boolean>((state) => state.ApplicationInfoScope.isVisibleNavBar);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [t] = useTranslation('translation');

    const actions = [
        { icon: <ArticleIcon/>, name: t('exportAsWord'), onClick: () => exportService.exportToWord() },
        { icon: <PictureAsPdfIcon/>, name: t('exportAsPDF'), onClick: () => exportService.exportToPDF() },
        { icon: <CodeIcon/>, name: t('exportAsHTML'), onClick: () => exportService.exportToHtml() },
        { icon: <WebIcon/>, name: t('exportAsXML'), onClick: () => exportService.exportToXml() },
    ];

    return (
        <SpeedDial
            ariaLabel={t('exportTheGeneratedDiff')}
            icon={<SpeedDialIcon/>}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            classes={useStyles({ isVisibleNavBar })}
            direction={'right'}
        >
            {actions.map((action) => (
                <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={() => {
                    if (action.onClick) {
                        action.onClick();
                    }
                    handleClose();
                }}/>
            ))}
        </SpeedDial>
    );
};
