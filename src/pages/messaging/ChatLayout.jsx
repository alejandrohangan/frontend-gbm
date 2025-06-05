import React, { useEffect, useState } from 'react';
import useEcho from '../../hooks/echo';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import ConversationItem from '../../components/messaging/ConversationItem';
import { ChatArea } from '../../components/messaging/ChatArea';

function ChatLayout() {
    const echo = useEcho();
    const { authUser } = useAuth();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [localMessages, setLocalMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState({});

    const sendMessage = async () => {
        if (!selectedConversation || !messageInput.trim()) return;

        // Crear mensaje temporal para mostrar inmediatamente
        const tempMessage = {
            id: `temp-${Date.now()}`,
            message: messageInput,
            sender_id: authUser.id,
            created_at: new Date().toISOString(),
            sending: true
        };

        // Agregar mensaje temporal al estado local
        setLocalMessages(prev => [...prev, tempMessage]);

        const messageText = messageInput;
        setMessageInput("");

        try {
            await apiService.request("post", `/send-message/${selectedConversation.id}`, {
                message: messageText
            });

            // Marcar mensaje como enviado exitosamente
            setLocalMessages(prev =>
                prev.map(msg =>
                    msg.id === tempMessage.id
                        ? { ...msg, sending: false, id: `sent-${Date.now()}` }
                        : msg
                )
            );
        } catch (error) {
            console.error("Error sending message:", error);

            // Marcar mensaje como fallido
            setLocalMessages(prev =>
                prev.map(msg =>
                    msg.id === tempMessage.id
                        ? { ...msg, sending: false, failed: true }
                        : msg
                )
            );
        }
    };

    const loadMessagesFromServer = async () => {
        if (!selectedConversation) return;

        setMessagesLoading(true);
        try {
            const response = await apiService.request("get", `/get-messages/${selectedConversation.id}`);
            if (response) {
                setLocalMessages(response);
            } else {
                console.warn("No messages data received:", response);
                setLocalMessages([]);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            setLocalMessages([]);
        } finally {
            setMessagesLoading(false);
        }
    };

    const getConversations = async () => {
        setLoading(true);
        try {
            const response = await apiService.request("get", `/get-conversations`);
            if (response) {
                setConversations(response);
            } else {
                console.error("Invalid API response structure:", response);
                setConversations([]);
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
            setConversations([]);
        } finally {
            setLoading(false);
        }
    };

    // Función para agregar mensaje recibido via websocket
    const handleMessageReceived = async () => {
        if (!selectedConversation) return;
        
        try {
            const response = await apiService.request("get", `/get-messages/${selectedConversation.id}`);
            if (response && response.length > localMessages.length) {
                // Solo agregar mensajes nuevos
                const newMessages = response.slice(localMessages.length);
                setLocalMessages(prev => [...prev, ...newMessages]);
            }
        } catch (error) {
            console.error("Error fetching new messages:", error);
        }
    };

    // Cargar conversaciones al inicio
    useEffect(() => {
        getConversations();
    }, []);

    // Cargar mensajes cuando se selecciona una conversación
    useEffect(() => {
        if (selectedConversation) {
            loadMessagesFromServer();
        } else {
            setLocalMessages([]);
        }
    }, [selectedConversation]);

    // Configurar Echo para detección de usuarios online
    useEffect(() => {
        if (!echo) return;

        echo.join("online")
            .here((users) => {
                const onlineUsersObject = Object.fromEntries(users.map((user) =>
                    [user.id, user])
                );
                setOnlineUsers((prevOnlineUsers) => {
                    return { ...prevOnlineUsers, ...onlineUsersObject };
                });
            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    updatedUsers[user.id] = user;
                    return updatedUsers;
                });
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    delete updatedUsers[user.id];
                    return updatedUsers;
                });
            })
            .error((error) => {
                console.error("Error en canal online:", error);
            });

        return () => {
            echo.leave("online");
        };
    }, [echo]);

    return (
        <div className="container-fluid h-100 d-flex" style={{ height: '90vh', maxHeight: '90vh' }}>
            {/* Sidebar */}
            <div className="col-md-4 col-lg-3 bg-white border-end d-flex flex-column" style={{ minWidth: '300px' }}>
                <div className="p-3 bg-white border-bottom">
                    <h1 className="h4 fw-bold text-dark mb-0">Conversaciones</h1>
                    <p className="text-muted small mb-0">Tus chats activos</p>
                </div>

                <ConversationItem
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    onConversationSelect={setSelectedConversation}
                    loading={loading}
                    onlineUsers={onlineUsers}
                />
            </div>

            {/* Chat Area */}
            <div className="col d-flex flex-column" style={{ minWidth: 0 }}>
                <ChatArea
                    selectedConversation={selectedConversation}
                    messages={localMessages}
                    messageInput={messageInput}
                    setMessageInput={setMessageInput}
                    onSendMessage={sendMessage}
                    loading={messagesLoading}
                    onlineUsers={onlineUsers}
                    authUser={authUser}
                    onMessageReceived={handleMessageReceived}
                />
            </div>
        </div>
    );
}

export default ChatLayout;