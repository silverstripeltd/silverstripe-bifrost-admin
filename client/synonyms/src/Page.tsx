import * as React from "react";
import { LocationType, MatchType } from ".";
import { useEffect } from "react";
import { useState } from "react";
import { SynonymRule, CMSApi } from "./api";
import { AddForm } from "./AddForm";
import { EditForm } from "./EditForm";
import { ForbiddenError } from "silverstripe-search-admin";

interface PageProps {
    api: CMSApi;
    match: MatchType;
    location: LocationType;
}

export default ({ api, match }: PageProps) => {
    const [synonymRules, setSynonymRules] = useState([]);
    const [apiError, setApiError] = useState('');
    const engine = match.params.engineName;
    const refresh = () => {
        setApiError('');
        api.getSynonyms(engine).then((resp: Array<SynonymRule>) => {
            setSynonymRules(resp);
            setApiError('');
        })
        .catch((e) => {
            console.error(e);
            if (e instanceof ForbiddenError) {
                setApiError("You don't have permission to view this content");
            } else {
                setApiError('Error fetching synonyms');
            }
        });
    };

    useEffect(() => {
        refresh();
    }, []);

    const addRule = api.addSynonymRule.bind(null, engine);

    const removeRule = (id: string) => {
        api.deleteSynonymRule(engine, id).then(() => {
            refresh();
        })
        .catch((e) => {
            console.error(e);
            if (e instanceof ForbiddenError) {
                setApiError("You don't have permission to delete a synonym");
            } else {
                setApiError('Error deleting synonym');
            }
        });
    };

    const updateRule = (rule: SynonymRule): Promise<SynonymRule> => {
        return api.updateSynonymRule(engine, rule).then((rule) => {
            refresh();
            return rule;
        })
    };

    function renderRules(rules: Array<SynonymRule>) {
        return rules.map((rule) => {
            const root = rule.root.length ? (<><strong>root</strong>: {rule.root.join(', ')}</>) : null;
            return (
            <li key={rule.id} data-rule-id={rule.id} className="list-group-item">
                <strong>type</strong>: {rule.type} {root} <strong>synonyms</strong>: {rule.synonyms.join(",")}
                <EditForm
                    update={updateRule}
                    onClose={refresh}
                    initialValues={{
                        id: rule.id,
                        synonyms: rule.synonyms.join("\n"),
                        root: rule.root.join("\n"),
                        type: rule.type,
                    }}
                />
                <button className="btn btn-outline-danger" onClick={() => removeRule(rule.id)}>delete</button>
            </li>
        )});
    }

    return (
        <>
            <h1>Synonym management</h1>
            <p>Here you can manage the synonyms for your engine</p>
            <AddForm
                add={addRule}
                onClose={refresh}
            />

            <h2>Synonyms:</h2>
            {(apiError ? <p className="alert alert-danger">{apiError}</p>: null)}
            <ul className="list-group">{renderRules(synonymRules)}</ul>
        </>
    );
};
