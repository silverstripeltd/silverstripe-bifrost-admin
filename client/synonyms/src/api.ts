import { ApiError, ForbiddenError, JsonError } from "silverstripe-search-admin";

interface DeletedRuleResponse {
    status: string
}

export interface CMSApi {
    getSynonyms(engine: string): Promise<Array<SynonymRule>>;
    addSynonymRule(engine: string, rule: SynonymRuleInput): Promise<SynonymRule>;
    updateSynonymRule(engine: string, rule: SynonymRule): Promise<SynonymRule>;
    deleteSynonymRule(engine: string, id: string): Promise<DeletedRuleResponse>;
}

export interface SynonymRuleInput {
    type: string;
    root: string[];
    synonyms: string[];
}

export interface SynonymRule extends SynonymRuleInput {
    id: string;
}

export type CMSApiConfig = {
    apiBase: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
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
}

export function createCMSApi(config: CMSApiConfig): CMSApi {
    return {
        async getSynonyms(engine: string): Promise<Array<SynonymRule>> {
            const endpoint = new URL(
                `${config.apiBase}/synonyms`,
                window.location.origin
            );
            endpoint.searchParams.set("engine", engine);
            const response = await fetch(endpoint);

            return handleResponse<Array<SynonymRule>>(response);
        },
        async addSynonymRule(
            engine: string,
            rule: SynonymRule
        ): Promise<SynonymRule> {
            const endpoint = new URL(
                `${config.apiBase}/${engine}/synonyms`,
                window.location.origin
            );
            const request = new Request(endpoint, {
                method: "POST",
                body: JSON.stringify(rule),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const response = await fetch(request);

            return handleResponse<SynonymRule>(response);
        },
        async updateSynonymRule(engine:string, rule: SynonymRule): Promise<SynonymRule> {
            const endpoint = new URL(
                `${config.apiBase}/${engine}/synonyms/${rule.id}`,
                window.location.origin
            );
            const request = new Request(endpoint, {
                method: "PATCH",
                body: JSON.stringify(rule),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const response = await fetch(request);

            return handleResponse<SynonymRule>(response);
        },
        async deleteSynonymRule(
            engine: string,
            id: string
        ): Promise<DeletedRuleResponse> {
            const endpoint = new URL(
                `${config.apiBase}/${engine}/synonyms/${id}`,
                window.location.origin
            );
            const request = new Request(endpoint, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const response = await fetch(request);

            return handleResponse<DeletedRuleResponse>(response);
        },
    };
}
