import React, { useEffect, useState } from "react";
import { EngineIcon } from "./components/EngineIcon";
import styles from "./menu.module.css";
import { useId } from "react";
import { useRouteMatch } from "react-router";
import { CMSApi } from "./api";
import { useEngines } from "./hooks/useEngines";
import { NavLink } from "react-router-dom";
import MenuItem from "./components/MenuItem";

interface Props {
    api: CMSApi;
}

export const Menu = ({ api }: Props) => {
    const [engines, error] = useEngines(api);
    const match = useRouteMatch(`/`);
    const selected = match?.isExact ?? false;
    const [expanded, setExpanded] = useState(!!match && !selected);
    const ulId = useId();
    const engineMenu = engines.map((engine) => {
        return (
            <li key={engine.name}>
                <MenuItem name={engine.name} />
            </li>
        );
    });

    // use path as identifier rather than object which changes each time
    useEffect(() => {
        if (!!match && !selected) {
            // open if a child menu is open
            setExpanded(true);
        }
    }, [match?.path, selected])

    return (
        <div>
            <div
                className={`${styles.expandContainer} ${
                    selected ? styles.selected : ""
                }`}
            >
                <button
                    className={`${styles.button} `}
                    onClick={() => setExpanded(!expanded)}
                    aria-expanded={expanded}
                    aria-controls={ulId}
                >
                    <div
                        className={`${styles.expand} ${
                            expanded ? styles.expanded : ""
                        }`}
                    >
                        ▶
                    </div>
                    <div className={styles.icon}>
                        <EngineIcon />
                    </div>
                </button>
                <NavLink
                    exact
                    to="/"
                    activeClassName={styles.selected}
                    className={styles.title}
                >
                    Engines
                </NavLink>
            </div>
            <ul
                id={ulId}
                className={`${styles.list} ${styles.engineList} ${expanded ? styles.expanded : ""}`}
            >
                {error && <p className="alert alert-danger">{error}</p>}
                {engineMenu}
            </ul>
        </div>
    );
};
