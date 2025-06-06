import React from 'react';

function ConversationItem({ conversations, selectedConversation, onConversationSelect, loading, onlineUsers }) {
  if (loading) {
    return (
      <div className="h-100 overflow-auto">
        <div className="p-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="d-flex align-items-center p-3 mb-2 rounded-3">
              <div className="me-3">
                <div
                  className="rounded-circle bg-secondary placeholder-glow"
                  style={{ width: '48px', height: '48px' }}
                >
                </div>
              </div>
              <div className="flex-fill">
                <div className="placeholder-glow">
                  <span className="placeholder col-6 rounded-pill mb-1"></span>
                </div>
                <div className="placeholder-glow">
                  <span className="placeholder col-4 rounded-pill"></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-100 overflow-auto">
      <div className="p-3">
        {conversations.map((conversation) => {
          const isOnline = onlineUsers[conversation.other_user_id];

          // Mostrar ticket_id o ticket_title, con fallback al nombre de usuario
          const displayTitle = conversation.ticket_title || `Ticket #${conversation.ticket_id}` || conversation.other_user_name;

          return (
            <button
              key={conversation.id}
              onClick={() => onConversationSelect(conversation)}
              className={`btn w-100 d-flex align-items-center p-3 rounded-3 mb-2 text-start border-0 ${selectedConversation?.id === conversation.id
                  ? 'bg-primary bg-opacity-10 text-primary'
                  : 'btn-outline-secondary hover-bg-light'
                }`}
              style={{
                transition: 'all 0.2s ease',
                backgroundColor: selectedConversation?.id === conversation.id ? 'rgba(13, 110, 253, 0.1)' : 'transparent'
              }}
            >
              <div className="position-relative me-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-medium"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)'
                  }}>
                  {conversation.other_user_name.charAt(0).toUpperCase()}
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
              <div className="flex-fill">
                <h6 className="fw-semibold mb-1 text-start">{displayTitle}</h6>
                <p className={`small mb-0 text-start ${isOnline ? 'text-success' : 'text-muted'}`}>
                  {conversation.other_user_name} - {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ConversationItem;