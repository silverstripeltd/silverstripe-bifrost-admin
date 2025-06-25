import styles from "./layout.module.css";
import * as React from "react";
import { Link } from "react-router-dom";
import {
    ComponentsState,
    ErrorComponentsState,
    Menu,
    Notifications,
    SwitchErrorInfo,
    MenuItemProps,
} from "piral";

const MenuItem: React.FC<MenuItemProps> = ({ children }) => (
    <li>{children}</li>
);

export const errors: Partial<ErrorComponentsState> = {
    not_found: () => (
        <div>
            <p className="error">
                Could not find the requested page. Are you sure it exists?
            </p>
            <p>
                Go back <Link to="/">to the Silverstripe Search dashboard</Link>
                .
            </p>
        </div>
    ),
};

export const layout: Partial<ComponentsState> = {
    ErrorInfo: (props) => (
        <div>
            <h1>Error</h1>
            <SwitchErrorInfo {...props} />
        </div>
    ),
    DashboardContainer: ({ children }) => (
        <div>
            <h2>Search administration</h2>
            <div className="tiles">{children}</div>
        </div>
    ),
    DashboardTile: ({ columns, rows, children }) => (
        <div className={`tile cols-${columns} rows-${rows}`}>{children}</div>
    ),
    Layout: ({ children }) => (
        <div className="silverstripe-search-admin">
            <Notifications />
            <div className={styles.adminContainer}>
                <div className={`${styles.header} ${styles.headerTitle} vertical-align-items`}>
                    <span className={styles.title}>Silverstripe Search</span>
                </div>
                <div className={`${styles.header} ${styles.breadcrumbs}`}></div>
                <div className={styles.sidebar}>
                    <Menu type="general" />
                </div>
                <div className={styles.contentHeader}>{children}</div>
            </div>
        </div>
    ),
    MenuContainer: ({ children }) => {
        return (
            <nav className={styles.nav} aria-label="Silverstripe Search administration">
                <ul className={styles.navList}>{children}</ul>
            </nav>
        );
    },
    MenuItem,
    NotificationsHost: ({ children }) => (
        <div className="notifications">{children}</div>
    ),
    NotificationsToast: ({ options, onClose, children }) => (
        <div className={`notification-toast ${options.type}`}>
            <div className="notification-toast-details">
                {options.title && (
                    <div className="notification-toast-title">
                        {options.title}
                    </div>
                )}
                <div className="notification-toast-description">{children}</div>
            </div>
            <div className="notification-toast-close" onClick={onClose} />
        </div>
    ),
};
