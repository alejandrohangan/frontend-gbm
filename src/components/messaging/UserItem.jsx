import React from 'react';
import { formatTimeAgo } from '../../utils/dateUtils';

function UserItem({ user, isActive, onClick }) {
    return (
        <li
            className={`
        p-4 flex items-center space-x-3 cursor-pointer transition-colors duration-200
        ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}
      `}
            onClick={onClick}
        >
            <div className="relative">
                <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover"
                />
                {user.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium truncate">{user.name}</h3>
                    <span className="text-xs text-gray-500">
                        {formatTimeAgo(user.lastMessageTime)}
                    </span>
                </div>

                <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 truncate">
                        {user.lastMessage}
                    </p>
                    {user.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                            {user.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </li>
    );
}

export default UserItem;