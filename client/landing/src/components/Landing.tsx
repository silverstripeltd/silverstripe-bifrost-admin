import React from "react";
import type { CMSApi } from "../api";
import { ForbiddenError } from "silverstripe-search-admin";
import SearchBanner from "./SearchBanner";
import styles from "./page.module.css";
import EngineTable from "./EngineTable";

interface Props {
    api: CMSApi;
}

export default ({ api }: Props) => {
    const [engines, setEngines] = React.useState([]);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        api.getEngines()
            .then(setEngines)
            .catch((e) => {
                console.error(e);
                let content = `Error fetching information about your search
                                    subscription. Please check your module installation.`;

                if (e instanceof ForbiddenError) {
                    content = `You do not have permission to access this content. Please check your permissions and/or API key configuration`;
                }

                setError(
                    <div className="engine">
                        <p>{content}</p>
                    </div>
                );
            });
    }, []);
    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Engines Overview <hr/></h2>
            <SearchBanner/>
            {error && <div className="alert alert-danger">{error}</div>}
            <EngineTable engines={engines} />
        </div>
    );
};
