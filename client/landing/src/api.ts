import { ApiError, ForbiddenError, JsonError } from "silverstripe-search-admin";

interface CMSConfig {
    apiBase: string;
}

enum FieldTypes {
  Text = "text",
  Binary = "binary",
  Date = "date",
  Number = "number",
}

type Schema = {
    [key: string]: FieldTypes
}

export interface CMSApi {
    getEngines(): Promise<Array<String>>;
    getSchema(indexName: string): Promise<Array<Schema>>;
}

export type SynonymRule = {
    id: string | number | null;
    type: string | null;
    root: string[];
    synonyms: string[];
};

export function createCMSApi(config: CMSConfig): CMSApi {
    return {
        async getEngines(): Promise<Array<String>> {
            const endpoint = `${config.apiBase}/engines`;
            const response = await fetch(endpoint);
            if (!response.ok) {
                const body = await response.text();
                switch(response.status) {
                    case 401:
                    case 403:
                        throw new ForbiddenError(response.status, 'Action not allowed', body)
                    default:
                        throw new ApiError(response.status, 'Error with API request', body);
                }
            }
            try {
                return response.json();
            } catch (e) {
                const body = await response.text();
                throw new JsonError(400, e.message, body)
            }
        },
        async getSchema(indexName: string): Promise<Array<Schema>> {
            const endpoint = `${config.apiBase}/schema?engine=${indexName}`;
            const response = await fetch(endpoint);
            if (!response.ok) {
                const body = await response.text();
                switch(response.status) {
                    case 401:
                    case 403:
                        throw new ForbiddenError(response.status, 'Action not allowed', body)
                    default:
                        throw new ApiError(response.status, 'Error with API request', body);
                }
            }
            try {
                return response.json();
            } catch (e) {
                const body = await response.text();
                throw new JsonError(400, e.message, body)
            }
        },
    };
}
