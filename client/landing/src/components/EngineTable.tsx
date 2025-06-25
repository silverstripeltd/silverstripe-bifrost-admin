import React from "react";
import styles from "./table.module.css";
import { Link } from "react-router-dom";
import { Engine } from "../hooks/useEngines";


interface Props {
    engines: Engine[];
}

export default ({ engines }: Props) => {
    const rows = engines.map(({name, totalDocs}) => {
        return (
            <tr key={name} className={styles.tr}>
                <td className={styles.td}>
                    <Link to={`engine/${name}`}>{name}</Link>
                </td>
                <td className={styles.td}>
                    {totalDocs}
                </td>
                <td className={styles.td}>
                    <Link to={`engine/${name}`}>
                        <i className="font-icon-edit" aria-label="Edit" />
                    </Link>
                </td>
            </tr>
        );
    });
    return (
        <div className={styles.container}>
            <h3 className={styles.tableTitle}>Engines</h3>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        <th className={styles.th}>Name</th>
                        <th className={styles.th}>Document count</th>
                        <th className={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody className={styles.tbody}>{rows}</tbody>
            </table>
        </div>
    );
};
