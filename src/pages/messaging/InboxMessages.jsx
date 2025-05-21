import React, { useEffect, useRef, useState } from 'react';
import useEcho from '../../hooks/echo';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

function InboxMessages() {
  const echo = useEcho();
  const { authUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [users, setUsers] = useState([]);

  const targetScrollRef = useRef(null);

  const scrollToBottom = () => {
    if (targetScrollRef.current) {
      targetScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sendMessage = async () => {
    if (!selectedUser || !messageInput.trim()) return;

    try {
      await apiService.request("post", `/send-message/${selectedUser.id}`, {
        message: messageInput
      });
      setMessageInput("");
      getMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getMessages = async () => {
    if (!selectedUser) return;

    try {
      const response = await apiService.request("get", `/get-messages/${selectedUser.id}`);
      if (response) {
        setMessages(response);
      } else {
        console.warn("No messages data received:", response);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  const getUsers = async () => {
    try {
      const response = await apiService.request("get", `/get-users`);
      if (response) {
        setUsers(response);
      } else {
        console.error("Invalid API response structure:", response);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      getMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [messages]);

  useEffect(() => {
    // Only proceed if all required dependencies exist
    if (!selectedUser || !echo || !authUser) {
      return; // Early return if any dependency is missing
    }

    const channel = echo.private(`chat.${selectedUser.id}`);

    channel.listen('.message.received', async () => {
      alert("Mensaje recibido")
      await getMessages();
    });

  }, [selectedUser, echo, authUser]);

  return (
    <div className="container-fluid h-100 d-flex bg-light" style={{ height: '90vh' }}>
      {/* Sidebar */}
      <div className="col-md-3 bg-white border-end border-light-subtle">
        <div className="p-3 bg-light fw-bold fs-5 border-bottom border-light-subtle">
          Inbox
        </div>
        <div className="p-3">
          {Array.isArray(users) ? users.map((user, key) => (
            <div
              key={key}
              onClick={() => setSelectedUser(user)}
              className={`d-flex align-items-center mb-3 ${user.id === selectedUser?.id ? 'bg-primary text-white' : ''} p-2 rounded cursor-pointer`}
              style={{ cursor: 'pointer' }}
            >
              <div className="rounded-circle bg-primary bg-opacity-25" style={{ width: '48px', height: '48px' }}></div>
              <div className="ms-3">
                <div className="fw-semibold">{user.name}</div>
              </div>
            </div>
          )) : (
            <div className="text-secondary">Cargando usuarios...</div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="col d-flex flex-column">
        {!selectedUser ? (
          <div className='h-100 d-flex justify-content-center align-items-center text-secondary fw-bold'>
            Select Conversation
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-3 border-bottom border-light-subtle d-flex align-items-center">
              <div className="rounded-circle bg-primary bg-opacity-25" style={{ width: '48px', height: '48px' }}></div>
              <div className="ms-3">
                <div className="fw-bold">{selectedUser.name}</div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow-1 overflow-auto p-3 bg-light" style={{ maxHeight: 'calc(90vh - 130px)' }}>
              {Array.isArray(messages) ? messages.map((message, index) => (
                <div
                  key={index}
                  className={`d-flex mb-3 ${message.sender_id === authUser.id ? "justify-content-end" : "justify-content-start"}`}
                >
                  <div
                    className={`${message.sender_id !== authUser.id
                      ? "bg-secondary bg-opacity-10 text-dark"
                      : "bg-primary text-white"
                      } p-2 rounded`}
                    style={{ maxWidth: '75%' }}
                  >
                    {message.message}
                  </div>
                </div>
              )) : (
                <div className="text-center text-secondary">Cargando mensajes...</div>
              )}
              <span ref={targetScrollRef}></span>
            </div>

            {/* Message Input */}
            <div className="p-3 bg-white border-top border-light-subtle">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="form-control"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="btn btn-primary">
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default InboxMessages;
