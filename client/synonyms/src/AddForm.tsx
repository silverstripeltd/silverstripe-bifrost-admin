import React, { ReactNode, useState } from "react";
import ReactModal from "react-modal";
import { SynonymRule, SynonymRuleInput } from "./api";
import { BaseForm, CreateFormValues } from "./BaseForm";
import { ForbiddenError } from "silverstripe-search-admin";
import styles from './form.module.css';
import btnStyles from "./buttons.module.css";
interface AddFormProps {
    add: (rule: SynonymRuleInput) => Promise<SynonymRule>;
    onClose: Function;
    buttonClasses?: string;
    text?: ReactNode;
}

export const AddForm = ({
    add,
    onClose,
    buttonClasses = "btn btn-primary",
    text = (
        <span className="vertical-align-items">
            <i
                style={{ lineHeight: "10px", marginRight: "0.5rem", fontSize: "1.2rem" }}
                className="font-icon-plus"
            />
            Create a synonym rule
        </span>
    ),
}: AddFormProps) => {
    const [open, setOpen] = useState(false);
    const [apiError, setApiError] = useState("");
    const closeModal = () => {
        setOpen(false);
        setApiError("");
    };
    const submit = (values: CreateFormValues, { setSubmitting }) => {
        const type = values.type;
        const synonyms = values.synonyms;

        const rule: SynonymRuleInput = {
            type,
            synonyms,
        };

        setSubmitting(true);
        add(rule)
            .then(() => {
                setSubmitting(false);
                closeModal();
                onClose();
            })
            .catch((e) => {
                console.error(e);
                setSubmitting(false);

                if (e instanceof ForbiddenError) {
                    setApiError(
                        "You don't have permission to create a synonym"
                    );
                } else {
                    setApiError("Error fetching synonyms");
                }
            });
    };

    const appElement = window.document.querySelector<HTMLElement>('.cms-container')
    return (
        <>
            <button className={buttonClasses} onClick={() => setOpen(true)}>
                {text}
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
                    <h3 className={styles.title}>Add a synonym</h3>
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

                <BaseForm onSubmit={submit} />

            </ReactModal>
        </>
    );
};
