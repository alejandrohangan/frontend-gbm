import React from 'react';

function ConversationItem({ users, selectedUser, onUserSelect, loading, onlineUsers }) {
  if (loading) {
    return (
      <div className="flex-fill p-3">
        <div className="d-flex flex-column gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="d-flex align-items-center p-3">
              <div className="bg-secondary rounded-circle placeholder-glow me-3" style={{ width: '48px', height: '48px' }}>
                <span className="placeholder w-100 h-100 rounded-circle"></span>
              </div>
              <div className="flex-fill">
                <div className="placeholder-glow mb-2">
                  <span className="placeholder col-8 rounded"></span>
                </div>
                <div className="placeholder-glow">
                  <span className="placeholder col-6 rounded"></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-fill overflow-auto">
      <div className="p-2">
        {users.map((user) => {
          const isOnline = onlineUsers[user.id];
          return (
            <button
              key={user.id}
              onClick={() => onUserSelect(user)}
              className={`btn w-100 d-flex align-items-center p-3 rounded-3 mb-2 text-start border-0 ${
                selectedUser?.id === user.id
                  ? 'bg-primary bg-opacity-10 text-primary'
                  : 'btn-outline-secondary hover-bg-light'
              }`}
              style={{
                transition: 'all 0.2s ease',
                backgroundColor: selectedUser?.id === user.id ? 'rgba(13, 110, 253, 0.1)' : 'transparent'
              }}
            >
              <div className="position-relative me-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)'
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {isOnline && (
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
              <div className="flex-fill text-start">
                <h6 className="mb-1 text-dark text-truncate fw-medium">{user.name}</h6>
                <small className={isOnline ? "text-success" : "text-muted"}>
                  {isOnline ? "Online" : "Offline"}
                </small>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ConversationItem;