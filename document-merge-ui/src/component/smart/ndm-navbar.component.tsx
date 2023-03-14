import '@resources/sass/component/ndm-navbar.component.sass';
import React from 'react';
import { Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@reducer';
import ChevronLeftIcon from '@mui/icons-material//ChevronLeft';
import { ApplicationInfoService, DialogService, SessionService } from '@service';
import { Documentation, ROUTES, TYPES, UserAuthority, UserInfo } from '@data';
import classNames from 'classnames';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SettingsIcon from '@mui/icons-material/Settings';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { openInNewTab, useHistoryPushWithSearch, useIsPage } from '@utils';
import { useTranslation } from 'react-i18next';
import { NDMAbout } from '@component/smart/ndm-about/ndm-about.component';

class NavBarItem {
    icon: React.ReactNode;
    text: string;
    url: string;
    external: boolean;
    constructor(icon: React.ReactNode, text: string, url: string, external = false) {
        this.icon = icon;
        this.text = text;
        this.url = url;
        this.external = external;
    }
}

class NavBarClickedItem {
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
    constructor(icon: React.ReactNode, text: string, onClick: () => void) {
        this.icon = icon;
        this.text = text;
        this.onClick = onClick;
    }
}

type NavBarItems = (NavBarItem | NavBarClickedItem)[];

const getTopList = (): NavBarItems => {
    const [t] = useTranslation('translation');

    //TODO: Make visible in the next sprint
    return [
        new NavBarItem(<CallMergeIcon />, t('mergeViewTitle'), ROUTES.MERGING.path),
        /*new NavBarItem(<SettingsIcon />, t('settingsTitle'), ROUTES.SETTINGS.path),
        new NavBarItem(<CollectionsBookmarkIcon />, t('preferencesTitle'), ROUTES.PREFERENCES.path),*/
    ];
};

const getBottomList = (): NavBarItems => {
    const dialogService = DIContainer.get<DialogService>(TYPES.DIALOG_SERVICE);
    const sessionService = DIContainer.get<SessionService>(TYPES.SESSION_SERVICE);
    const documentation = useSelector<RootState, Documentation>((state) => state.ApplicationInfoScope.documentation);
    const userAuthorities = useSelector<RootState, UserAuthority[]>((state) => state.UserInfoScope.currentUserInfo.userAuthorities);
    const [isShowLicense, setIsShowLicense] = React.useState<boolean>(false);
    const [t] = useTranslation('translation');

    React.useEffect(() => {
        sessionService.isAdmin().then((isAdmin) => {
            setIsShowLicense(isAdmin);
        });
    }, [userAuthorities]);

    const items: NavBarItems = [];

    if (isShowLicense) {
        items.push(new NavBarItem(<VpnKeyIcon />, 'License', ROUTES.LICENSE_SETTINGS.path));
    }

    items.push(new NavBarClickedItem(<InfoOutlinedIcon />, t('aboutTitle'), () => dialogService.show(<NDMAbout />)));

    if (documentation.visible) {
        items.push(new NavBarItem(<MenuBookIcon />, t('documentationTitle'), documentation.url, true));
    }
    return items;
};

export const NDMNavBar: React.FC = () => {
    const isVisibleNavBar = useSelector<RootState, boolean>((state) => state.ApplicationInfoScope.isVisibleNavBar);
    const appInfoService = DIContainer.get<ApplicationInfoService>(TYPES.APPLICATION_INFO_SERVICE);
    const { historyPush } = useHistoryPushWithSearch();
    const topList = getTopList();
    const bottomList = getBottomList();
    const isLoginPage = useIsPage(ROUTES.LOGIN.path);

    const handleDrawerClose = () => {
        appInfoService.setIsVisibleNavBar(false);
    };

    const className = classNames({
        'ndm-navbar_open': isVisibleNavBar,
        'ndm-navbar_close': !isVisibleNavBar,
    });

    const renderItems = (items: NavBarItems, divider: boolean) => {
        return items.map((item) => (
            <ListItem
                button
                className='ndm-navbar__list-item'
                key={item.text}
                divider={divider}
                onClick={() => {
                    if (item instanceof NavBarClickedItem) {
                        return item.onClick();
                    }
                    return item.external ? openInNewTab(item.url) : historyPush(item.url);
                }}
            >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
            </ListItem>
        ));
    };

    return (
        <Drawer
            className={`ndm-navbar ${className}`}
            variant='permanent'
            anchor='left'
            open={isVisibleNavBar}
            classes={{
                paper: className,
            }}
        >
            <div className='ndm-navbar__header'>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider className='ndm-navbar__divider' />
            {!isLoginPage && <List>{renderItems(topList, true)}</List>}
            <div style={{ flexGrow: 1 }} />
            <Divider className='ndm-navbar__divider' />
            <List>{renderItems(bottomList, false)}</List>
        </Drawer>
    );
};
