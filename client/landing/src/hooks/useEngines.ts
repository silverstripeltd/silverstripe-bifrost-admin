import React from "react";
import { CMSApi } from "../api";
import { ForbiddenError } from "silverstripe-search-admin";

export type Engine = {
    name: string;
    totalDocs: number;
};

export function useEngines(api: CMSApi): [Engine[], string | null] {
    const [engines, setEngines] = React.useState([]);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        api.getEngines()
            .then((engines) => {
                setEngines(engines)
                setError(null);
            })
            .catch((e) => {
                console.error(e);
                let content = `Error fetching information about your search
                                        subscription. Please check the module installation.`;

                if (e instanceof ForbiddenError) {
                    content = `You do not have permission to access this content. Please check your permissions and/or API key configuration`;
                }

                setError(content);
            });
    }, []);
    return [engines, error];
}
