import * as React from "react";
import type { MatchType } from "..";
import styles from "./page.module.css";
import tableStyles from "./table.module.css";
import { CMSApi } from "../api";

interface PageProps {
    match: MatchType;
    api: CMSApi;
}

const Table = ({ rows }) => {
    return (
        <div className={tableStyles.container}>
            <h3 className={tableStyles.tableTitle}>Engine schema</h3>
            <table className={tableStyles.table}>
                <thead>
                    <tr>
                        <th className={tableStyles.th}>Field name</th>
                        <th className={tableStyles.th}>Field type</th>
                    </tr>
                </thead>
                <tbody className={tableStyles.tbody}>{rows}</tbody>
            </table>
        </div>
    );
};

export default ({ match, api }: PageProps) => {
    const engineName = match?.params?.engineName;
    const [schema, setSchema] = React.useState(null);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        if (!engineName) {
            return;
        }
        api.getSchema(engineName)
            .then((data) => {
                setSchema(data);
                setError(null);
            })
            .catch((err) => {
                setSchema(null);
                setError("Error loading schema");
            });
    }, [engineName]);

    const out = Object.keys(schema ?? {}).map((key) => {
        const value = schema[key];
        return (
            <tr key={key} className={tableStyles.tr}>
                <td className={`${tableStyles.code} ${tableStyles.td}`}>{key}</td>
                <td className={tableStyles.td}>
                    <select className={tableStyles.select} name="type" value={value} disabled>
                        <option value="text">text</option>
                        <option value="date">date</option>
                        <option value="binary">binary</option>
                        <option value="number">number</option>
                    </select>
                </td>
            </tr>
        );
    });

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>
                {match.params.engineName} <hr />
            </h2>
            {!engineName && <div className="danger">Could not find engine</div>}
            {error && <div className="danger">{error}</div>}
            {engineName && schema && <Table rows={out} />}
        </div>
    );
};
