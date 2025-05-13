import React, { useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Phone, Video, MoreVertical } from 'lucide-react';

function ConversationView({ activeUser, messages, onSendMessage }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (!activeUser) {
        return (
            <div className="d-flex flex-grow-1 align-items-center justify-content-center bg-light p-4">
                <div className="text-center" style={{ maxWidth: "400px" }}>
                    <h3 className="h5 text-secondary mb-2">Select a conversation</h3>
                    <p className="text-muted">Choose a conversation from the list to start messaging</p>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column flex-grow-1 bg-light">
            <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-white">
                <div className="d-flex align-items-center gap-3">
                    <img
                        src={activeUser.avatar}
                        alt={activeUser.name}
                        className="rounded-circle"
                        width={40}
                        height={40}
                    />
                    <div>
                        <h3 className="h6 mb-0 text-dark">{activeUser.name}</h3>
                        <small className="text-muted">
                            {activeUser.isOnline ? 'Online now' : 'Offline'}
                        </small>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-link text-muted p-0">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-grow-1 overflow-auto p-3">
                <MessageList messages={messages} />
                <div ref={messagesEndRef} />
            </div>

            <div className="border-top bg-white">
                <MessageInput onSendMessage={onSendMessage} />
            </div>
        </div>
    );
}

export default ConversationView;
