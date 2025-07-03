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
                    switch (e.code) {
                        case 401:
                           content = `Your API key does not have permission to access the service.
                                Please check that it is configured correctly.`;
                            break;
                        default:
                            content = `You don't have permission to view this content.
                               Please check that you have the appropriate CMS permissions set.`;
                    }
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
