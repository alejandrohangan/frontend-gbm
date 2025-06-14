import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ActionsTemplate = ({ ticket, onView, onSet, onEdit, onDelete, onClose, hasDelete, hasClose, hasView, hasEdit = true }) => {
    const handleView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onSet) onSet();
        if (onView) onView();
    };

    const handleEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onSet) onSet();
        if (onEdit) onEdit();
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDelete) onDelete(ticket.id);
    };

    const handleClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
    };

    return (
        <div className="d-flex justify-content-center align-items-center gap-2">
            {hasView && (
                <button
                    className="btn btn-outline-primary btn-sm action-button"
                    title="Ver detalle"
                    onClick={handleView}
                    type="button"
                >
                    <i className="bi bi-eye"></i>
                </button>
            )}

            {hasEdit && (
                <button
                    className="btn btn-outline-secondary btn-sm action-button"
                    title="Editar ticket"
                    onClick={handleEdit}
                    type="button"
                >
                    <i className="bi bi-pencil"></i>
                </button>
            )}

            {hasDelete && (
                <button
                    className="btn btn-outline-danger btn-sm action-button"
                    title="Eliminar ticket"
                    onClick={handleDelete}
                    type="button"
                >
                    <i className="bi bi-trash"></i>
                </button>
            )}

            {hasClose && (
                <button
                    className="btn btn-outline-success btn-sm action-button"
                    title="Cerrar ticket"
                    onClick={handleClose}
                    type="button"
                >
                    <i className="bi bi-lock-fill"></i>
                </button>
            )}
        </div>
    );
};

export default ActionsTemplate;