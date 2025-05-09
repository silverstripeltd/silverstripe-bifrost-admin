import React, { useState } from "react";
import ReactModal from "react-modal";
import { SynonymRule } from "./api";
import { BaseForm, UpdateFormValues } from "./BaseForm";

interface EditFormProps {
    update: (rule: SynonymRule) => Promise<SynonymRule>;
    onClose: Function;
    initialValues: UpdateFormValues
}

export const EditForm = ({ update, onClose, initialValues }: EditFormProps) => {
    const [open, setOpen] = useState(false);
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
            <button className="btn btn-outline-info" onClick={() => setOpen(!open)}>Edit</button>
            <ReactModal
                isOpen={open}
                onRequestClose={() => setOpen(false)}
                style={{
                    overlay: {
                        zIndex: 100,
                    },
                }}
            >
                <h3>Edit synonym</h3>
                <BaseForm onSubmit={submit} initialValues={initialValues} />
            </ReactModal>
        </>
    );
};
