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
    <li className="nav-item">{children}</li>
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
        <div>
            <Notifications />
            <Menu type="general" />
            <div className="container">{children}</div>
        </div>
    ),
    MenuContainer: ({ children }) => {
        const [collapsed, setCollapsed] = React.useState(true);
        return (
            <header>
                <nav className="navbar navbar-light navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3">
                    <div className="container">
                        <Link className="navbar-brand" to="/">
                            Silverstripe Search 🔎
                        </Link>
                        <button
                            aria-label="Toggle navigation"
                            type="button"
                            onClick={() => setCollapsed(!collapsed)}
                            className="navbar-toggler mr-2"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div
                            className={`collapse navbar-collapse d-sm-inline-flex flex-sm-row-reverse ${
                                collapsed ? "" : "show"
                            }`}
                            aria-expanded={!collapsed}
                        >
                            <ul className="navbar-nav flex-grow">{children}</ul>
                        </div>
                    </div>
                </nav>
            </header>
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
