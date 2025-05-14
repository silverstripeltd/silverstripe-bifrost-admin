import React, { useState } from "react";
import ReactModal from "react-modal";
import { SynonymRule } from "./api";
import { BaseForm, UpdateFormValues } from "./BaseForm";
import { ForbiddenError } from "silverstripe-search-admin";

interface EditFormProps {
    update: (rule: SynonymRule) => Promise<SynonymRule>;
    onClose: Function;
    initialValues: UpdateFormValues
}

export const EditForm = ({ update, onClose, initialValues }: EditFormProps) => {
    const [open, setOpen] = useState(false);
    const [apiError, setApiError] = useState('');
    const closeModal = () => {
        setOpen(false);
        setApiError('');
    }
    const submit = (values: UpdateFormValues, { setSubmitting }) => {
        const id = values.id;
        const type = values.type;
        const synonyms = values.synonyms ? values.synonyms.split(/\r?\n/g) : [];
        const root = values.root ? values.root.split(/\r?\n/g) : [];

        const rule: SynonymRule = {
            id,
            type,
            synonyms,
            root,
        };

        setSubmitting(true);
        update(rule)
            .then(() => {
                setSubmitting(false);
                closeModal()
                onClose();
            })
            .catch((e) => {
                console.error(e);
                setSubmitting(false);
                if (e instanceof ForbiddenError) {
                    setApiError("You don't have permission to edit a synonym");
                } else {
                    setApiError('Error fetching synonyms');
                }
            });
    };

    return (
        <>
            <button className="btn btn-outline-info" onClick={() => setOpen(true)}>Edit</button>
            <ReactModal
                isOpen={open}
                onRequestClose={closeModal}
                style={{
                    overlay: {
                        zIndex: 100,
                    },
                }}
            >
                <h3>Edit synonym</h3>
                {(apiError ? <p className="alert alert-danger">{apiError}</p>: null)}
                <BaseForm onSubmit={submit} initialValues={initialValues} />
            </ReactModal>
        </>
    );
};
