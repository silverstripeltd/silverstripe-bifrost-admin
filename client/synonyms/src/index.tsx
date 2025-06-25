import * as React from "react";
import type { PiletApi } from "silverstripe-search-admin";
import "./styles.scss";
import { createCMSApi } from "./api";
import MenuItem from "./MenuItem";

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
    const api = createCMSApi({ apiBase: app.meta.config.apiBase });
    app.registerPage("/engine/:engineName/synonyms", (props) => (
        <Page api={api} {...props} />
    ));

    app.registerExtension("engine-menu-item", MenuItem, {
        base: "/engine",
        slug: "synonyms",
        text: "Synonyms",
    });
}
