import React, { useState } from 'react';
import UserItem from './UserItem';
import { Search } from 'lucide-react';

function UsersList({ users, activeUser, onSelectUser }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="d-flex flex-column border-end bg-white h-100" style={{ width: '100%', maxWidth: '24rem' }}>
            {/* Search Bar */}
            <div className="border-bottom px-3 py-3">
                <div className="position-relative">
                    <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        className="form-control ps-5"
                        placeholder="Search conversations"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* User list */}
            <div className="flex-grow-1 overflow-auto">
                {filteredUsers.length > 0 ? (
                    <ul className="list-group list-group-flush">
                        {filteredUsers.map(user => (
                            <UserItem
                                key={user.id}
                                user={user}
                                isActive={activeUser?.id === user.id}
                                onClick={() => onSelectUser(user)}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="px-3 py-4 text-center text-muted small">
                        No conversations match your search
                    </div>
                )}
            </div>
        </div>
    );
}

export default UsersList;
