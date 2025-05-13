import React from 'react';
import { formatMessageTime } from '../../utils/dateUtils';
import { Check, CheckCheck } from 'lucide-react';

function MessageItem({ message }) {
    const isSentByCurrentUser = message.senderId === 'current-user';

    return (
        <div className={`d-flex ${isSentByCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}>
            <div
                className={`
          p-3 rounded 
          ${isSentByCurrentUser
                        ? 'bg-primary text-white rounded-end-0'
                        : 'bg-white text-dark border border-light rounded-start-0'}
          `}
                style={{ maxWidth: '75%' }}
            >
                <p className="mb-1 small">{message.content}</p>
                <div
                    className={`d-flex align-items-center gap-1 mt-1 text-muted small justify-content-end`}
                >
                    <span>{formatMessageTime(message.timestamp)}</span>

                    {isSentByCurrentUser && (
                        message.status === 'read'
                            ? <CheckCheck size={12} />
                            : <Check size={12} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default MessageItem;
