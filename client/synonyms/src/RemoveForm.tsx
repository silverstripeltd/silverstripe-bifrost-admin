import React, { useState } from "react";
import ReactModal from "react-modal";
import { ForbiddenError } from "silverstripe-search-admin";
import styles from "./form.module.css";
import btnStyles from './buttons.module.css';

interface RemoveConfirmProps {
    remove: (id: string) => Promise<any>;
    onClose: Function;
    id: string;
}

export const RemoveForm = ({ remove, id, onClose }: RemoveConfirmProps) => {
    const [open, setOpen] = useState(false);
    const [apiError, setApiError] = useState("");
    const closeModal = () => {
        setOpen(false);
        setApiError("");
    };
    const doRemove = (id) => {
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
    };

    const appElement =
        window.document.querySelector<HTMLElement>(".cms-container");

    return (
        <>
            <button
                className={btnStyles.iconButton}
                onClick={() => setOpen(true)}
                aria-label="Delete"
            >
                <i className="font-icon-trash-bin"></i>
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
                    <h3 className={styles.title}>Remove synonym?</h3>
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
                <div className={styles.formBody}>
                    <p>Are you sure? This action cannot be undone.</p>
                </div>
                <div className={styles.formFooter}>
                    <button
                        className="btn btn-primary"
                        onClick={() => doRemove(id)}
                    >
                        Yes delete it
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => closeModal()}
                    >
                        cancel
                    </button>
                </div>
            </ReactModal>
        </>
    );
};
