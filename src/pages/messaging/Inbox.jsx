import React, { useEffect, useRef, useState } from 'react'
import useEcho from '../../hooks/echo';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

function Inbox() {
  const echo = useEcho();
  const { authUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [users, setUsers] = useState([]);

  const targetScrollRef = useRef(null);
  const selectedUserRef = useRef(null);

  const scrollToBottom = () => {
    if (targetScrollRef.current) {
      targetScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sendMessage = async () => {
    if (!selectedUserRef.current || !messageInput.trim()) return;

    try {
      // Usando el formato apiService.request en lugar de axios.post
      await apiService.request("post", `/send-message/${selectedUserRef.current.id}`, {
        message: messageInput
      });
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getMessages = async () => {
    if (!selectedUserRef.current) return;

    try {
      // Usando el formato apiService.request en lugar de axios.get
      const response = await apiService.request("get", `/get-messages/${selectedUserRef.current.id}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const getUsers = async () => {
    try {
      // Usando el formato apiService.request en lugar de axios.get
      const response = await apiService.request("get", `/get-users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
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
    let channel;

    if (selectedUser && echo) {
      // Conectar al canal de chat del usuario seleccionado
      channel = echo.private(`chat.${authUser.id}`); // Escuchamos en nuestro propio canal
      channel.listen('.message.received', async (e) => {
        await getMessages();
      });
    }

    return () => {
      if (channel) {
        channel.stopListening('.message.received');
      }
    };
  }, [selectedUser]);

  return (
    <div className="h-screen flex bg-gray-100" style={{ height: '90vh' }}>
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200">
        <div className="p-4 bg-gray-100 font-bold text-lg border-b border-gray-200">
          Inbox
        </div>
        <div className="p-4 space-y-4">
          {/* Contact List */}
          {users.map((user, key) => (
            <div
              key={key}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center ${user.id === selectedUser?.id ? 'bg-blue-500 text-white' : ''} p-2 hover:bg-blue-500 hover:text-white rounded cursor-pointer`}
            >
              <div className="w-12 h-12 bg-blue-200 rounded-full"></div>
              <div className="ml-4">
                <div className="font-semibold">{user.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col w-3/4">
        {!selectedUser &&
          <div className='h-full flex justify-center items-center text-gray-800 font-bold'>
            Select Conversation
          </div>
        }
        {selectedUser &&
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center">
              <div className="w-12 h-12 bg-blue-200 rounded-full"></div>
              <div className="ml-4">
                <div className="font-bold">{selectedUser?.name}</div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender_id === authUser.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`${message.sender_id !== authUser.id
                      ? "bg-gray-200 text-gray-800"
                      : "bg-blue-500 text-white"
                      } p-3 rounded-lg max-w-xs`}
                  >
                    {message.message}
                  </div>
                </div>
              ))}
              <span ref={targetScrollRef}></span>
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Send
                </button>
              </div>
            </div>
          </>
        }
      </div>
    </div>
  );
}

export default Inbox;