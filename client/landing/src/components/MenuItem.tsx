import React, { useContext, useEffect, useId, useState } from "react";
import styles from "../menu.module.css";
import { useRouteMatch } from "react-router";
import { NavLink } from "react-router-dom";
import { PiralContext } from "..";

interface Props {
    name: string;
}

export default ({ name }: Props) => {
    const Extension = useContext(PiralContext);
    const ulId = useId();
    const match = useRouteMatch(`/engine/${name}`);
    const selected = match?.isExact ?? false;
    const [expanded, setExpanded] = useState(!!match || selected);

    useEffect(() => {
        if (!!match || selected) {
            // open if a this or a child menu is open
            setExpanded(true);
        }
    }, [match?.path, selected]);
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
                </button>
                <NavLink
                    exact
                    to={`/engine/${name}`}
                    activeClassName={styles.selected}
                    className={styles.title}
                >
                    {name}
                </NavLink>
            </div>
            <ul
                id={ulId}
                className={`${styles.list} ${styles.engineItemList} ${
                    expanded ? styles.expanded : ""
                }`}
            >
                {/* individual menu items provided by pilets */}
                <Extension
                    name="engine-menu-item"
                    params={{
                        engine: name,
                    }}
                />
            </ul>
        </div>
    );
};
