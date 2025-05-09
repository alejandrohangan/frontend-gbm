import React, { useEffect, useState } from "react";
import apiService from "../services/apiService";
import useEcho from '../hooks/echo';
import { useAuth } from "../contexts/AuthContext";
import SimpleNotification from "./tickets/SimpleNotification";

function Prueba() {
    const { user } = useAuth();
    const idReceiver = 2;
    const echo = useEcho();
    const message = 'Pakistani cabron';
    const [notification, setNotification] = useState(null);

    // Escuchar eventos de broadcasting
    useEffect(() => {
        if (echo) {
            const channel = echo.private(`chat.${idReceiver}`);
            channel.listen('.message.received', (data) => {
                console.log('Mensaje recibido:', data);
            });

            const staffChanel = echo.private(`notifications.staff`);
            staffChanel.listen('.notification.received', (data) => {
                setNotification(data.message);

                setTimeout(() => {
                    setNotification(null);
                }, 5000);
            });
        }

        return () => {
            // Limpiar al desmontar el componente
            if (echo) {
                echo.disconnect();
            }
        };
    }, [echo, idReceiver]);

    // Función para enviar el mensaje
    const sendTestMessage = async () => {
        try {
            await apiService.request("post", `/send-message/`, {
                sender: user.id,
                receiver: idReceiver,
                message: message,
            });
            console.log("Mensaje enviado correctamente");
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    };

    const sendNotification = async () => {
        try {
            await apiService.request("post", `/send-notification/`, {
                sender: user.id,
            });
            console.log("Notificación enviada correctamente");
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    };

    return (
        <div>
            <button onClick={sendTestMessage}>Enviar mensaje de prueba</button>
            <button onClick={sendNotification}>Enviar Notificación de prueba</button>

            <SimpleNotification message={notification} />
        </div>
    );
}

export default Prueba;