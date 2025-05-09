// src/services/echo.js
import axios from "axios";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configuración global para Pusher
window.Pusher = Pusher;

// Función para crear una instancia de Echo
export const createEchoInstance = () => {
    return new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        authorizer: channel => {
            return {
                authorize: (socketId, callback) => {
                    axios.post('http://127.0.0.1:8000/api/broadcasting/auth', {
                        socket_id: socketId,
                        channel_name: channel.name
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    })
                        .then(response => {
                            callback(false, response.data);
                        })
                        .catch(error => {
                            callback(true, error);
                        });
                }
            };
        },
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
    });
};

// Instancia única para importación directa
const echo = createEchoInstance();
export default echo;