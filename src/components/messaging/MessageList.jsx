import React from 'react';
import MessageItem from './MessageItem';
import { groupMessagesByDate } from '../../utils/messageUtils';

function MessageList({ messages }) {
    const groupedMessages = groupMessagesByDate(messages);

    if (messages.length === 0) {
        return (
            <div className="d-flex align-items-center justify-content-center h-100">
                <p className="text-muted">No messages yet. Start the conversation!</p>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column gap-4">
            {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date} className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-center">
                        <span className="small bg-light text-secondary px-3 py-1 rounded-pill">
                            {date}
                        </span>
                    </div>

                    {msgs.map((message) => (
                        <MessageItem key={message.id} message={message} />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default MessageList;