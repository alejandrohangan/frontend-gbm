import React, { useState } from 'react';
import { Smile, Paperclip, Mic, Send } from 'lucide-react';

function MessageInput({ onSendMessage }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex align-items-end gap-2 px-3 py-3 border-top">
            {/* Iconos de Smile y Paperclip */}
            <div className="d-flex align-items-center gap-2">
                <button type="button" className="btn btn-link text-muted p-0">
                    <Smile size={20} />
                </button>
                <button type="button" className="btn btn-link text-muted p-0">
                    <Paperclip size={20} />
                </button>
            </div>

            {/* Input del mensaje */}
            <div className="flex-grow-1 position-relative">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="form-control"
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary d-flex align-items-center justify-content-center rounded-circle p-2"
                style={{ width: '40px', height: '40px' }}
            >
                <Send size={18} />
            </button>

        </form>
    );
}

export default MessageInput;
