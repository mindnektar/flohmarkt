import React from 'react';
import classnames from 'classnames';
import useAuth, { AUTH_TYPE_ADMIN, AUTH_TYPE_VENDOR } from 'hooks/useAuth';
import { useHistory, useLocation } from 'react-router';

const Menu = () => {
    const history = useHistory();
    const location = useLocation();
    const { authType } = useAuth();

    const menuItems = [{
        label: 'Besucher-Bereich',
        items: [
            { label: 'Startseite', path: '/' },
        ],
    }, {
        label: 'Verkäufer-Bereich',
        available: authType === AUTH_TYPE_VENDOR || authType === AUTH_TYPE_ADMIN,
        items: [
            { label: 'Meine Artikel', path: '/vendor/articles' },
            { label: 'Account', path: '/vendor/account' },
        ],
    }, {
        label: 'Admin-Bereich',
        available: authType === AUTH_TYPE_ADMIN,
        items: [
            { label: 'Flohmärkte', path: '/admin/markets' },
            { label: 'Admins', path: '/admin/admins' },
        ],
    }];

    const navigateHandler = (path) => () => {
        if (location.pathname === path) {
            return;
        }

        history.push(path);
    };

    return (
        <div className="menu">
            {menuItems.map((group) => (
                group.available !== false && (
                    <div
                        key={group.label}
                        className="menu__group"
                    >
                        <div className="menu__group-label">
                            {group.label}
                        </div>

                        {group.items.map((item) => (
                            <div
                                key={item.label}
                                className={classnames(
                                    'menu__item',
                                    { 'menu__item--active': item.path === location.pathname },
                                )}
                                onClick={navigateHandler(item.path)}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                )
            ))}
        </div>
    );
};

export default Menu;
