import React, { useRef, useEffect, useState } from 'react';
import { Send, MoreVertical, X, Info } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import useEcho from '../../hooks/echo';
import { useAuth } from '../../contexts/AuthContext';

export function ChatArea({
    selectedConversation,
    messages,
    messageInput,
    setMessageInput,
    onSendMessage,
    loading,
    onlineUsers,
    authUser,
    onMessageReceived,
    onCloseTicket,
    onViewDetails
}) {
    const messagesEndRef = useRef(null);
    const echo = useEcho();
    const { authUser: contextAuthUser } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const timer = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timer);
    }, [messages]);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Listener de Echo para mensajes recibidos
    useEffect(() => {
        if (!selectedConversation || !echo || !contextAuthUser) {
            return;
        }

        const channel = echo.private(`chat.${contextAuthUser.id}`);

        const handleMessageReceived = () => {
            if (onMessageReceived) {
                onMessageReceived();
            }
        };

        channel.listen('.message.received', handleMessageReceived);

        return () => {
            channel.stopListening('.message.received');
        };
    }, [selectedConversation, echo, contextAuthUser, onMessageReceived]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    const handleCloseTicket = () => {
        setShowDropdown(false);
        if (onCloseTicket && selectedConversation) {
            onCloseTicket(selectedConversation);
        }
    };

    const handleViewDetails = () => {
        setShowDropdown(false);
        if (onViewDetails && selectedConversation) {
            // Asumiendo que selectedConversation tiene un ticket_id o id del ticket
            const ticketId = selectedConversation.ticket_id || selectedConversation.id;
            onViewDetails(ticketId);
        }
    };

    if (!selectedConversation) {
        return (
            <div className="h-100 d-flex align-items-center justify-content-center bg-light">
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

    const isUserOnline = onlineUsers[selectedConversation.other_user_id];

    return (
        <div className="h-100 d-flex flex-column">
            {/* Header fijo */}
            <div className="bg-white border-bottom p-3 shadow-sm flex-shrink-0">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="position-relative me-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-medium"
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)'
                                }}>
                                {selectedConversation.other_user_name.charAt(0).toUpperCase()}
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
                            <h2 className="fw-semibold text-dark mb-0 h5">
                                {selectedConversation.ticket_title || `Ticket #${selectedConversation.ticket_id}`} - {selectedConversation.other_user_name}
                            </h2>
                            <p className={`small mb-0 ${isUserOnline ? 'text-success' : 'text-muted'}`}>
                                {isUserOnline ? "Online" : "Offline"}
                            </p>
                        </div>
                    </div>

                    {/* Dropdown menu */}
                    <div className="position-relative" ref={dropdownRef}>
                        <button
                            className="btn btn-link text-muted p-2"
                            onClick={() => setShowDropdown(!showDropdown)}
                            style={{
                                border: 'none',
                                background: 'none',
                                fontSize: '16px'
                            }}
                        >
                            <MoreVertical size={20} />
                        </button>

                        {showDropdown && (
                            <div
                                className="dropdown-menu dropdown-menu-end show position-absolute shadow-lg border-0"
                                style={{
                                    right: '0',
                                    top: '100%',
                                    minWidth: '200px',
                                    zIndex: 1050,
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <button
                                    className="dropdown-item d-flex align-items-center py-2 px-3 border-0 bg-transparent"
                                    onClick={handleViewDetails}
                                    style={{
                                        transition: 'background-color 0.2s ease',
                                        borderRadius: '8px',
                                        margin: '4px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <Info size={16} className="me-2 text-primary" />
                                    <span className="text-dark">Ver detalles</span>
                                </button>
                                <div className="dropdown-divider my-1"></div>
                                <button
                                    className="dropdown-item d-flex align-items-center py-2 px-3 border-0 bg-transparent"
                                    onClick={handleCloseTicket}
                                    style={{
                                        transition: 'background-color 0.2s ease',
                                        borderRadius: '8px',
                                        margin: '4px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <X size={16} className="me-2 text-danger" />
                                    <span className="text-danger">Cerrar ticket</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages area - crece y tiene scroll */}
            <div className="flex-grow-1 overflow-auto p-3"
                style={{
                    background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
                    minHeight: 0 // Importante para flexbox
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

            {/* Message Input - fijo en la parte inferior */}
            <div className="bg-white border-top p-3 shadow-sm flex-shrink-0">
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
        </div>
    );
}