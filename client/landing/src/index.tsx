import React from "react";
import { Link } from "react-router-dom";
import { type PiletApi, ForbiddenError } from "silverstripe-search-admin";
import "./styles.scss";
import { createCMSApi } from "./api";

export type MatchType = {
    params: {
        engineName: string;
    };
};

export type LocationType = {
    pathname: string;
};

const Page = React.lazy(() => import("./Page"));

export function setup(app: PiletApi) {
    app.registerPage("/engine/:engineName", Page);

    const api = createCMSApi({ apiBase: app.meta.config.apiBase });
    api.getEngines()
        .then((data) => {
            data.map((engine) => {
                app.registerTile(
                    () => (
                        <div className="engine">
                            <Link to={`engine/${engine}`}>{engine}</Link>
                            <p>Manage engine</p>
                        </div>
                    ),
                    {
                        initialColumns: 2,
                        initialRows: 2,
                    }
                );
            });
        })
        .catch((e) => {
            console.error(e);
            let content = `Error fetching information about your search
                            subscription. Please check the module installation.`;

            if (e instanceof ForbiddenError) {
                content = `You do not have permission to access this content. Please check your permissions and/or API key configuration`
            }

            app.registerTile(
                () => (
                    <div className="engine">
                        <p>
                            {content}
                        </p>
                    </div>
                ),
                {
                    initialColumns: 2,
                    initialRows: 2,
                }
            );
        });
}
