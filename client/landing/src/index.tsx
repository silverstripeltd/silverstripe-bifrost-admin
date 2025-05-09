import React from "react";
import { Link } from "react-router-dom";
import type { PiletApi } from "silverstripe-search-admin";
import "./styles.scss";

export type MatchType = {
    params: {
        engineName: string
    }
}

export type LocationType = {
    pathname: string
}

const Page = React.lazy(() => import("./Page"));

export function setup(app: PiletApi) {
    app.registerPage("/engine/:engineName", Page);

    app.getEngines().then((data) => {
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
        })
    });
}
