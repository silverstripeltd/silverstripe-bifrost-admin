import React, { useState } from "react";
import ReactModal from "react-modal";
import { SynonymRule } from "./api";
import { BaseForm, UpdateFormValues } from "./BaseForm";
import { ForbiddenError } from "silverstripe-search-admin";
import styles from "./form.module.css";
import btnStyles from "./buttons.module.css";

interface EditFormProps {
    update: (rule: SynonymRule) => Promise<SynonymRule>;
    remove?: (id: string) => Promise<any>;
    onClose: Function;
    initialValues: UpdateFormValues;
}

export const EditForm = ({
    update,
    onClose,
    initialValues,
    remove,
}: EditFormProps) => {
    const [open, setOpen] = useState(false);
    const [apiError, setApiError] = useState("");
    const closeModal = () => {
        setOpen(false);
        setApiError("");
    };
    const submit = (values: UpdateFormValues, { setSubmitting }) => {
        const id = values.id;
        const type = values.type;
        const synonyms = values.synonyms;

        const rule: SynonymRule = {
            id,
            type,
            synonyms,
        };

        setSubmitting(true);
        update(rule)
            .then(() => {
                setSubmitting(false);
                closeModal();
                onClose();
            })
            .catch((e) => {
                console.error(e);
                setSubmitting(false);
                if (e instanceof ForbiddenError) {
                    setApiError("You don't have permission to edit a synonym");
                } else {
                    setApiError("Error fetching synonyms");
                }
            });
    };

    const doRemove = (id) =>
        remove(id)
            .then(() => {
                closeModal();
                onClose();
            })
            .catch((e) => {
                console.error(e);

                if (e instanceof ForbiddenError) {
                    setApiError("You don't have permission to remove synonyms");
                } else {
                    setApiError("Error fetching synonyms");
                }
            });

    const appElement =
        window.document.querySelector<HTMLElement>(".cms-container");
    return (
        <>
            <button
                className={btnStyles.iconButton}
                onClick={() => setOpen(true)}
                aria-label="Edit"
            >
                <i className="font-icon-edit"></i>
            </button>
            <ReactModal
                appElement={appElement}
                portalClassName="silverstripe-search-admin__modal"
                isOpen={open}
                onRequestClose={closeModal}
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <div className={styles.header}>
                    <h3 className={styles.title}>Edit synonym</h3>
                    <button
                        className={btnStyles.iconButton}
                        onClick={closeModal}
                        aria-label="close"
                    >
                        <i className="font-icon-cancel"></i>
                    </button>
                </div>
                {apiError ? (
                    <p className="alert alert-danger">{apiError}</p>
                ) : null}
                <BaseForm
                    onSubmit={submit}
                    initialValues={initialValues}
                    removeSynonym={doRemove}
                />
            </ReactModal>
        </>
    );
};
