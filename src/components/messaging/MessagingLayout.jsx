import React, { useState } from 'react';
import UsersList from './UsersList';
import ConversationView from './ConversationView';
import { mockUsers, mockMessages } from '../../data/mockMessagingData';
import { MountainSnow } from 'lucide-react';

function MessagingLayout() {
    const [users, setUsers] = useState(mockUsers);
    const [activeUser, setActiveUser] = useState(null);
    const [messages, setMessages] = useState([]);

    const handleSelectUser = (user) => {
        setActiveUser(user);

        const updatedUsers = users.map(u =>
            u.id === user.id ? { ...u, unreadCount: 0 } : u
        );
        setUsers(updatedUsers);

        setMessages(mockMessages.filter(msg =>
            msg.senderId === user.id || msg.receiverId === user.id
        ));
    };

    const handleSendMessage = (content) => {
        if (!activeUser || !content.trim()) return;

        const newMessage = {
            id: `msg-${Date.now()}`,
            content,
            senderId: 'current-user',
            receiverId: activeUser.id,
            timestamp: new Date(),
            status: 'sent'
        };

        setMessages([...messages, newMessage]);
    };

    return (
        <div className="d-flex flex-column vh-100 bg-light text-dark">
            {/* Header */}
            <header className="bg-white border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                    <MountainSnow size={24} className="text-primary" />
                    <h1 className="h5 m-0">Messages</h1>
                </div>
            </header>

            {/* Main layout */}
            <div className="d-flex flex-grow-1 overflow-hidden">
                <div className="border-end overflow-auto" style={{ width: '300px' }}>
                    <UsersList
                        users={users}
                        activeUser={activeUser}
                        onSelectUser={handleSelectUser}
                    />
                </div>

                <div className="flex-grow-1 overflow-auto">
                    <ConversationView
                        activeUser={activeUser}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                    />
                </div>
            </div>
        </div>
    );
}

export default MessagingLayout;
