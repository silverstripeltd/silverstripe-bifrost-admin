import React, { useState } from "react";
import ReactModal from "react-modal";
import { ForbiddenError } from "silverstripe-search-admin";

interface RemoveConfirmProps {
    remove: (id: string) => Promise<any>;
    onClose: Function;
    id: string;
}

export const RemoveConfirm = ({ remove, id, onClose }: RemoveConfirmProps) => {
    const [open, setOpen] = useState(false);
    const [apiError, setApiError] = useState('');
    const closeModal = () => {
        setOpen(false);
        setApiError('');
    }
    const doRemove = (id) => {
        remove(id)
            .then(() => {
                closeModal()
                onClose();
            })
            .catch((e) => {
                console.error(e);

                if (e instanceof ForbiddenError) {
                    setApiError("You don't have permission to remove synonyms");
                } else {
                    setApiError('Error fetching synonyms');
                }
            })
    };

    return (
        <>
            <button className="btn btn-outline-danger" onClick={() => setOpen(true)}>Delete</button>
            <ReactModal
                isOpen={open}
                onRequestClose={closeModal}
                style={{
                    overlay: {
                        zIndex: 100,
                    },
                }}
            >
                <h3>Remove synonym?</h3>
                {(apiError ? <p className="alert alert-danger">{apiError}</p>: null)}
                <p>Are you sure?</p>
                <button className="btn btn-danger" onClick={() => doRemove(id)}>Yes, remove</button>
                <button className="btn btn-info" onClick={() => doRemove(id)}>cancel</button>
            </ReactModal>
        </>
    );
};
