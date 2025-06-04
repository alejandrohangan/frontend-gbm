import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import useEcho from '../../hooks/echo';
import { useAuth } from '../../contexts/AuthContext';

export function ChatArea({
    selectedUser,
    messages,
    messageInput,
    setMessageInput,
    onSendMessage,
    loading,
    onlineUsers,
    authUser,
    onMessageReceived // Función para manejar mensajes recibidos
}) {
    const messagesEndRef = useRef(null);
    const echo = useEcho();
    const { authUser: contextAuthUser } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const timer = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timer);
    }, [messages]);

    // Listener de Echo para mensajes recibidos
    useEffect(() => {
        if (!selectedUser || !echo || !contextAuthUser) {
            return;
        }

        const channel = echo.private(`chat.${contextAuthUser.id}`);

        const handleMessageReceived = () => {
            // Solo llamar a la función si es necesario
            if (onMessageReceived) {
                onMessageReceived();
            }
        };

        channel.listen('.message.received', handleMessageReceived);

        return () => {
            channel.stopListening('.message.received');
        };
    }, [selectedUser, echo, contextAuthUser, onMessageReceived]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    if (!selectedUser) {
        return (
            <div className="flex-fill d-flex align-items-center justify-content-center bg-light">
                <div className="text-center">
                    <div className="d-flex align-items-center justify-content-center bg-secondary rounded-circle mx-auto mb-3"
                        style={{ width: '64px', height: '64px' }}>
                        <Send className="text-white" size={32} />
                    </div>
                    <h3 className="h5 fw-medium text-dark mb-2">Selecciona una conversación</h3>
                    <p className="text-muted">Elige de tus conversaciones existentes para empezar a enviar mensajes</p>
                </div>
            </div>
        );
    }

    const isUserOnline = onlineUsers[selectedUser.id];

    return (
        <>
            {/* Chat Header */}
            <div className="bg-white border-bottom p-3 shadow-sm">
                <div className="d-flex align-items-center">
                    <div className="position-relative me-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-medium"
                            style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)'
                            }}>
                            {selectedUser.name.charAt(0).toUpperCase()}
                        </div>
                        {isUserOnline && (
                            <div
                                className="position-absolute bg-success border border-white rounded-circle"
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    bottom: '-2px',
                                    right: '-2px'
                                }}
                            ></div>
                        )}
                    </div>
                    <div>
                        <h2 className="fw-semibold text-dark mb-0 h5">{selectedUser.name}</h2>
                        <p className={`small mb-0 ${isUserOnline ? 'text-success' : 'text-muted'}`}>
                            {isUserOnline ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-fill overflow-auto p-3"
                style={{
                    minHeight: 0,
                    background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)'
                }}>
                {loading ? (
                    <div className="d-flex align-items-center justify-content-center h-100">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="d-flex flex-column">
                            {messages.map((message, index) => (
                                <MessageBubble
                                    key={message.id || index}
                                    message={message}
                                    isOwn={message.sender_id === authUser.id}
                                />
                            ))}
                        </div>
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-top p-3 shadow-sm">
                <div className="d-flex align-items-end gap-3">
                    <div className="flex-fill">
                        <textarea
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe un mensaje..."
                            className="form-control border-0 bg-light"
                            rows={1}
                            style={{
                                minHeight: '44px',
                                maxHeight: '120px',
                                resize: 'none',
                                borderRadius: '22px',
                                paddingLeft: '16px',
                                paddingRight: '16px'
                            }}
                        />
                    </div>
                    <button
                        onClick={onSendMessage}
                        disabled={!messageInput.trim()}
                        className="btn btn-primary rounded-circle p-0"
                        style={{
                            minWidth: '44px',
                            minHeight: '44px',
                            background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
                            border: 'none'
                        }}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </>
    );
}