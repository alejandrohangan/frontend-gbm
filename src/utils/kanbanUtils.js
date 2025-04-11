export const COLUMNS = [
    { id: 'open', title: 'open' },
    { id: 'in_progress', title: 'in_progress' },
    { id: 'on_hold', title: 'on_hold' },
    { id: 'closed', title: 'closed' },
    { id: 'cancelled', title: 'cancelled' },
];

export const groupTicketsByStatus = (tickets) => {
    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
        return {};
    }

    return tickets.reduce((acc, ticket) => {
        const status = ticket.status || 'Sin Estado';
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(ticket);
        return acc;
    }, {});
};

export const calculateMaxColumnHeight = (ticketsByStatus) => {
    if (Object.keys(ticketsByStatus).length === 0) {
        return 3; // Default minimum height
    }

    return Math.max(
        3, // Minimum height even if empty
        ...Object.values(ticketsByStatus).map(statusTickets => statusTickets.length)
    );
};

export const getPriorityColor = (priority) => {
    if (!priority || !priority.name) return "#4ade80"; // Default green

    switch (priority.name) {
        case "Crítica": return "#f87171";
        case "Alta": return "#fb923c";
        case "Media": return "#60a5fa";
        default: return "#4ade80";
    }
};