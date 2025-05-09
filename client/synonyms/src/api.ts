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

export function createCMSApi(config: CMSApiConfig): CMSApi {
    return {
        async getSynonyms(engine: string): Promise<Array<SynonymRule>> {
            const endpoint = new URL(
                `${config.apiBase}/synonyms`,
                window.location.origin
            );
            endpoint.searchParams.set("engine", engine);
            const response = await fetch(endpoint);

            return response.json();
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

            return response.json();
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

            return response.json();
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

            return response.json();
        },
    };
}
