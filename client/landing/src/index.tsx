import React, { createContext, ReactElement } from "react";
import { type PiletCoreApi, type PiletApi } from "silverstripe-search-admin";
import "./styles.scss";
import { createCMSApi } from "./api";
import { Menu } from "./Menu";

export type MatchType = {
    params: {
        engineName: string;
    };
};

export type LocationType = {
    pathname: string;
};

export const styles = ["index.css"];

export const PiralContext = createContext<PiletCoreApi["Extension"]>(null);

const Landing = React.lazy(() => import("./components/Landing"));
const Engine = React.lazy(() => import("./components/Engine"));

export function setup(app: PiletApi) {
    const api = createCMSApi({ apiBase: app.meta.config.apiBase });
    app.registerMenu(
        "engines",
        () => (
            <PiralContext.Provider value={app.Extension}>
                <Menu api={api} />
            </PiralContext.Provider>
        ),
        { type: "general" }
    );
    app.registerPage("/", () => <Landing api={api} />);
    app.registerPage("/engine/:engineName", (props) => <Engine {...props} api={api} />);
}
