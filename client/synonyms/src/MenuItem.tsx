import React from "react";
import styles from "./menuitem.module.css";
import { NavLink, useRouteMatch } from "react-router-dom";

interface Props {
    params: {
        engine: string;
        base: string;
        slug: string;
        text: string;
    }
}

export default ({ params: {engine, base, slug, text} }: Props) => {
    const route = [base, engine, slug].join('/');
    const match = useRouteMatch(route);
    const selected = match?.isExact ?? false;
    return (
        <li className={`${ selected && styles.selected} ${styles.expandContainer}`}>
            <NavLink
                exact
                to={route}
                activeClassName={styles.selected}
                className={styles.title}
            >
                {text}
            </NavLink>
        </li>
    );
};
