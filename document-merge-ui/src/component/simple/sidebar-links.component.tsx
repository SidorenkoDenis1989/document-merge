import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { useHistoryPushWithSearch } from '@utils';
import { List, ListItem, ListItemIcon } from '@mui/material';

export interface SideBarLinksItem {
    path?: string;
    icon?: React.ReactElement;
    element: string | React.ReactElement;
    onClick?: () => void;
}

export interface SideBarLinksProps {
    items: SideBarLinksItem[];
}

export const SideBarLinks: React.FC<SideBarLinksProps> = ({ items }) => {
    const { historyPush } = useHistoryPushWithSearch();

    return (
        <List>
            {items.map(({ icon, element, path, onClick }, index) => (
                <li key={path || index}>
                    <ListItem button={true} onClick={() => (path ? historyPush(path) : null)}>
                        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                        {typeof element === 'string' ? (
                            <NavLink
                                className={'sidebar_link'}
                                to={path}
                                onClick={(event) => {
                                    event.preventDefault();
                                    if (onClick) {
                                        onClick();
                                    }
                                }}
                            >
                                {element}
                            </NavLink>
                        ) : (
                            element
                        )}
                    </ListItem>
                </li>
            ))}
        </List>
    );
};
