import React, { useState } from "react";
import ReactModal from "react-modal";
import { SynonymRule, SynonymRuleInput } from "./api";
import { BaseForm, CreateFormValues } from "./BaseForm";
import { ForbiddenError } from "silverstripe-search-admin";

interface AddFormProps {
    add: (rule: SynonymRuleInput) => Promise<SynonymRule>;
    onClose: Function;
}

export const AddForm = ({ add, onClose }: AddFormProps) => {
    const [open, setOpen] = useState(false);
    const [apiError, setApiError] = useState('');
    const closeModal = () => {
        setOpen(false);
        setApiError('');
    }
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
                closeModal()
                onClose();
            })
            .catch((e) => {
                console.error(e);
                setSubmitting(false);

                if (e instanceof ForbiddenError) {
                    setApiError("You don't have permission to create a synonym");
                } else {
                    setApiError('Error fetching synonyms');
                }
            })
    };

    return (
        <>
            <button className="btn btn-info" onClick={() => setOpen(true)}>Add synonym</button>
            <ReactModal
                isOpen={open}
                onRequestClose={closeModal}
                style={{
                    overlay: {
                        zIndex: 100,
                    },
                }}
            >
                <h3>Add a synonym</h3>
                {(apiError ? <p className="alert alert-danger">{apiError}</p>: null)}
                <BaseForm onSubmit={submit} />
            </ReactModal>
        </>
    );
};
