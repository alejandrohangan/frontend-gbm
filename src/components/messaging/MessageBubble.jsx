import React from 'react';
import { Check, CheckCheck, AlertCircle } from 'lucide-react';

export function MessageBubble({ message, isOwn }) {
    const renderMessageStatus = () => {
        if (!isOwn) return null;

        if (message.failed) {
            return <AlertCircle size={14} className="text-danger ms-1" />;
        }

        if (message.sending) {
            return (
                <div className="spinner-border spinner-border-sm text-white-50 ms-1"
                    style={{ width: '14px', height: '14px' }} role="status">
                    <span className="visually-hidden">Enviando...</span>
                </div>
            );
        }

        // Mensaje enviado exitosamente
        return <CheckCheck size={14} className="text-white-50 ms-1" />;
    };

    return (
        <div className={`d-flex mb-3 ${isOwn ? "justify-content-end" : "justify-content-start"}`}>
            <div
                className={`${isOwn
                    ? "bg-primary text-white"
                    : "bg-white text-dark border"
                    } p-3 rounded-4 shadow-sm ${message.failed ? 'border-danger' : ''}`}
                style={{
                    maxWidth: '75%',
                    borderRadius: isOwn ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    opacity: message.sending ? 0.7 : 1
                }}
            >
                <p className="mb-0">{message.message}</p>
                <div className="d-flex align-items-center justify-content-between mt-1">
                    <small className={`${isOwn ? 'text-white-50' : 'text-muted'}`}>
                        {new Date(message.created_at).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </small>
                    {renderMessageStatus()}
                </div>
                {message.failed && (
                    <small className="text-danger d-block mt-1">
                        Error al enviar. Toca para reintentar.
                    </small>
                )}
            </div>
        </div>
    );
}