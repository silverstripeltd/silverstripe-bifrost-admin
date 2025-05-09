import { PiralPlugin } from "piral-core";

interface CMSConfig {
    apiBase: string;
}

interface PiletCMSApi {
    getEngines(): Promise<Array<String>>;
}

export type SynonymRule = {
    id: string | number | null;
    type: string | null;
    root: string[];
    synonyms: string[];
};

declare module "piral-core/lib/types/custom" {
    interface PiletCustomApi extends PiletCMSApi {}
}

export function createCMSApi(config: CMSConfig): PiralPlugin<PiletCMSApi> {
    return (context) => (api, target) => ({
        async getEngines(): Promise<Array<String>> {
            const endpoint = `${config.apiBase}/engines`;
            const response = await fetch(endpoint);

            return response.json();
        }
    });
}
