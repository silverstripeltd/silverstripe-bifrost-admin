import React, { useState } from "react";
import ReactModal from "react-modal";
import { SynonymRule, SynonymRuleInput } from "./api";
import { BaseForm, CreateFormValues } from "./BaseForm";

interface AddFormProps {
    add: (rule: SynonymRuleInput) => Promise<SynonymRule>;
    onClose: Function;
}

export const AddForm = ({ add, onClose }: AddFormProps) => {
    const [open, setOpen] = useState(false);
    const submit = (values: CreateFormValues, { setSubmitting }) => {
        const type = values.type;
        const synonyms = values.synonyms.split(/\r?\n/g);
        const root = values.root.split(/\r?\n/g);

        const rule: SynonymRuleInput = {
            type,
            synonyms,
            root,
        };

        setSubmitting(true);
        add(rule)
            .then(() => {
                setSubmitting(false);
                setOpen(false);
                onClose();
            })
            .catch((e) => {
                console.error(e);
                setSubmitting(false);
            });
    };

    return (
        <>
            <button className="btn btn-info" onClick={() => setOpen(!open)}>Add synonym</button>
            <ReactModal
                isOpen={open}
                onRequestClose={() => setOpen(false)}
                style={{
                    overlay: {
                        zIndex: 100,
                    },
                }}
            >
                <h3>Add a synonym</h3>
                <BaseForm onSubmit={submit} />
            </ReactModal>
        </>
    );
};
