import * as React from "react";
import { LocationType, MatchType } from ".";
import { useEffect } from "react";
import { useState } from "react";
import { SynonymRule, CMSApi } from "./api";
import { AddForm } from "./AddForm";
import { EditForm } from "./EditForm";
import { ForbiddenError } from "silverstripe-search-admin";
import { RemoveForm } from "./RemoveForm";
import pageStyles from "./page.module.css";
import tableStyles from "./table.module.css";
import synonymStyles from "./synonym.module.css";

interface PageProps {
    api: CMSApi;
    match: MatchType;
    location: LocationType;
}

export default ({ api, match }: PageProps) => {
    const [synonymRules, setSynonymRules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const engine = match.params.engineName;
    const refresh = () => {
        setApiError("");
        setLoading(true);
        api.getSynonyms(engine)
            .then((resp: Array<SynonymRule>) => {
                setSynonymRules(resp);
                setApiError("");
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
                console.error(e);
                if (e instanceof ForbiddenError) {
                    setApiError(
                        "You don't have permission to view this content"
                    );
                } else {
                    setApiError("Error fetching synonyms");
                }
            });
    };

    useEffect(() => {
        refresh();
    }, []);

    const addRule = api.addSynonymRule.bind(null, engine);

    const removeRule = (id: string): Promise<any> => {
        return api.deleteSynonymRule(engine, id);
    };

    const updateRule = (rule: SynonymRule): Promise<SynonymRule> => {
        return api.updateSynonymRule(engine, rule).then((rule) => {
            refresh();
            return rule;
        });
    };

    function renderRules(rules: Array<SynonymRule>) {
        return rules.map((rule) => {
            return (
                <tr key={rule.id} className={tableStyles.tr}>
                    <td className={tableStyles.td}>
                        {rule.synonyms.join(",")}
                    </td>
                    <td className={`${tableStyles.td} ${tableStyles.nostretch}`}>
                        <EditForm
                            update={updateRule}
                            remove={removeRule}
                            onClose={refresh}
                            initialValues={{
                                id: rule.id,
                                synonyms: rule.synonyms,
                                type: rule.type,
                            }}
                        />
                        <RemoveForm
                            id={rule.id}
                            remove={removeRule}
                            onClose={refresh}
                        />
                    </td>
                </tr>
            );
        });
    }

    const none = synonymRules.length || loading ? null : (
        <div className={synonymStyles.none}>
            <h4 className={synonymStyles.noneTitle}>
                You haven't created any synonyms
            </h4>
            <p className={synonymStyles.noneLead}>
                Synonyms relate queries with similar context or meaning
                together. Use them to guide users to relevant content.
            </p>
            <AddForm
                add={addRule}
                onClose={refresh}
                text="Create your first synonym set"
                buttonClasses="btn btn-outline-info"
            />
        </div>
    );

    return (
        <div className={`${pageStyles.page} ${synonymStyles.page}`}>
            <h2 className={`${pageStyles.title} ${synonymStyles.title}`}>
                Synonym management
            </h2>
            <p className={synonymStyles.lead}>
                Use synonyms to relate queries together that contextually have
                the same meaning in your dataset.
            </p>
            <hr className={synonymStyles.hr} />

            {apiError ? <p className="alert alert-danger">{apiError}</p> : null}

            <div
                className={`${tableStyles.container} ${synonymStyles.tableContainer}`}
            >
                <h3 className={tableStyles.tableTitle}>Synonyms</h3>
                <div>
                    <AddForm add={addRule} onClose={refresh} />
                </div>
                <table
                    className={`${tableStyles.table} ${synonymStyles.table}`}
                >
                    <thead>
                        <tr>
                            <th className={tableStyles.th}>Values</th>
                            <th className={tableStyles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={tableStyles.tbody}>
                        {renderRules(synonymRules)}
                    </tbody>
                </table>
                {loading && ( <div className={synonymStyles.none}>loading...</div>)}
                {none && none}
            </div>
        </div>
    );
};
