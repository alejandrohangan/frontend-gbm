import React, { useEffect, useState } from 'react';
import useEcho from '../../hooks/echo';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import ConversationItem from '../../components/messaging/ConversationItem';
import { ChatArea } from '../../components/messaging/ChatArea';

function ChatLayout() {
    const echo = useEcho();
    const { authUser } = useAuth();
    const [selectedUser, setSelectedUser] = useState(null);
    const [localMessages, setLocalMessages] = useState([]); // Estado local para mensajes
    const [messageInput, setMessageInput] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState({});

    const sendMessage = async () => {
        if (!selectedUser || !messageInput.trim()) return;

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
            await apiService.request("post", `/send-message/${selectedUser.id}`, {
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
        if (!selectedUser) return;

        setMessagesLoading(true);
        try {
            const response = await apiService.request("get", `/get-messages/${selectedUser.id}`);
            if (response) {
                setLocalMessages(response); // Cargar mensajes al estado local
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

    const getUsers = async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    // Función para agregar mensaje recibido via websocket
    const handleMessageReceived = async () => {
        // En lugar de recargar todos los mensajes, obtenemos solo el nuevo mensaje
        // O mejor aún, si el websocket envía el mensaje completo, lo agregamos directamente
        try {
            const response = await apiService.request("get", `/get-messages/${selectedUser.id}`);
            if (response && response.length > localMessages.length) {
                // Solo agregar mensajes nuevos
                const newMessages = response.slice(localMessages.length);
                setLocalMessages(prev => [...prev, ...newMessages]);
            }
        } catch (error) {
            console.error("Error fetching new messages:", error);
        }
    };

    // Cargar usuarios al inicio
    useEffect(() => {
        getUsers();
    }, []);

    // Cargar mensajes cuando se selecciona un usuario (solo al cambiar conversación)
    useEffect(() => {
        if (selectedUser) {
            loadMessagesFromServer();
        } else {
            setLocalMessages([]); // Limpiar mensajes cuando no hay usuario seleccionado
        }
    }, [selectedUser]);

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
                    <h1 className="h4 fw-bold text-dark mb-0">Mensajes</h1>
                    <p className="text-muted small mb-0">Conversaciones recientes</p>
                </div>

                <ConversationItem
                    users={users}
                    selectedUser={selectedUser}
                    onUserSelect={setSelectedUser}
                    loading={loading}
                    onlineUsers={onlineUsers}
                />
            </div>

            {/* Chat Area */}
            <div className="col d-flex flex-column" style={{ minWidth: 0 }}>
                <ChatArea
                    selectedUser={selectedUser}
                    messages={localMessages} // Usar mensajes locales
                    messageInput={messageInput}
                    setMessageInput={setMessageInput}
                    onSendMessage={sendMessage}
                    loading={messagesLoading}
                    onlineUsers={onlineUsers}
                    authUser={authUser}
                    onMessageReceived={handleMessageReceived} // Cambiar nombre para ser más claro
                />
            </div>
        </div>
    );
}

export default ChatLayout;