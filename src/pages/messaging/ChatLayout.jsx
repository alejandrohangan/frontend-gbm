import React, { useEffect, useState } from 'react';
import useEcho from '../../hooks/echo';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import TicketService from '../../services/TicketService';
import ConversationItem from '../../components/messaging/ConversationItem';
import { ChatArea } from '../../components/messaging/ChatArea';
import CustomModal from '../../components/CustomModal';
import ViewTicket from '../tickets/ViewTicket';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

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

    // Estados para el modal de detalles del ticket
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

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

    // Función para cerrar ticket (compartida entre ChatArea y ConversationItem)
    const handleCloseTicket = async (conversation) => {
        try {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción cerrará el ticket asociado a esta conversación",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, cerrar",
                cancelButtonText: "Cancelar",
            });

            if (result.isConfirmed) {
                // Asumiendo que el ticket_id está en la conversación
                const ticketId = conversation.ticket_id || conversation.id;
                const response = await TicketService.close(ticketId);

                if (response.success) {
                    toast.success('Ticket cerrado correctamente');
                    
                    // Si el ticket cerrado es el de la conversación actualmente seleccionada,
                    // deseleccionar la conversación
                    if (selectedConversation && selectedConversation.id === conversation.id) {
                        setSelectedConversation(null);
                        setLocalMessages([]);
                    }
                    
                    // Actualizar las conversaciones
                    getConversations();
                } else {
                    toast.error('No se pudo cerrar el ticket');
                }
            }
        } catch (error) {
            console.error('Error closing ticket:', error);
            toast.error('Error al procesar la solicitud');
        }
    };

    // Función para ver detalles del ticket
    const handleViewDetails = (ticketId) => {
        setSelectedTicketId(ticketId);
        setShowViewModal(true);
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
        <>
            {/* Cambio principal: usar vh y d-flex con altura fija */}
            <div className="container-fluid d-flex" style={{ height: '90vh' }}>
                {/* Sidebar - altura fija y scroll interno */}
                <div
                    className="bg-white border-end d-flex flex-column"
                    style={{
                        width: '300px',
                        minWidth: '300px',
                        height: '100%' // Altura completa del contenedor padre
                    }}
                >
                    {/* Header fijo del sidebar */}
                    <div className="p-3 bg-white border-bottom flex-shrink-0">
                        <h1 className="h4 fw-bold text-dark mb-0">Conversaciones</h1>
                        <p className="text-muted small mb-0">Tus chats activos</p>
                    </div>

                    {/* Lista de conversaciones con scroll */}
                    <div className="flex-grow-1 overflow-auto">
                        <ConversationItem
                            conversations={conversations}
                            selectedConversation={selectedConversation}
                            onConversationSelect={setSelectedConversation}
                            loading={loading}
                            onlineUsers={onlineUsers}
                        />
                    </div>
                </div>

                {/* Chat Area - ocupa el resto del espacio */}
                <div className="flex-grow-1 d-flex flex-column" style={{ height: '100%', minWidth: 0 }}>
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
                        onCloseTicket={handleCloseTicket}
                        onViewDetails={handleViewDetails}
                    />
                </div>
            </div>

            {/* Modal para ver detalles del ticket */}
            <CustomModal
                show={showViewModal}
                handleClose={() => setShowViewModal(false)}
                title={`Detalles del Ticket #${selectedTicketId}`}
                size="xl"
            >
                <ViewTicket ticketId={selectedTicketId} />
            </CustomModal>
        </>
    );
}

export default ChatLayout;