import { formatMessageDate } from './dateUtils';

export const groupMessagesByDate = (messages) => {
    const grouped = {};

    messages.forEach(message => {
        const dateKey = formatMessageDate(message.timestamp);

        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }

        grouped[dateKey].push(message);
    });

    return grouped;
};