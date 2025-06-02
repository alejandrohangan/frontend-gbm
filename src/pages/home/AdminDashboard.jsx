import React, { useEffect, useState } from 'react';
import DashboardService from '../../services/DashboardService';
import { StatsCard } from '../components/dashboard/StatsCard';
import { TicketChart } from '../components/dashboard/TicketChart';
import { RecentTickets } from '../components/dashboard/RecentTickets';
import { PriorityDistribution } from '../components/dashboard/PriorityDistribution';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    UserCog
} from 'lucide-react';

function AdminDashboard() {
    const [dashboardData, setDashboardData] = useState({
        stats: {},
        ticketTrends: [],
        priorityDistribution: [],
        recentTickets: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await DashboardService.getAll();
            if (response?.data) {
                // Calcular porcentajes para distribución de prioridades
                const totalTickets = response.data.priorityDistribution.reduce(
                    (sum, item) => sum + item.count, 0
                );

                const priorityWithPercentages = response.data.priorityDistribution.map(item => ({
                    ...item,
                    percentage: totalTickets > 0 ? Math.round((item.count / totalTickets) * 100) : 0
                }));

                setDashboardData({
                    ...response.data,
                    priorityDistribution: priorityWithPercentages
                });
            }
        } catch (err) {
            setError('Error loading dashboard data');
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    const { stats, ticketTrends, priorityDistribution, recentTickets } = dashboardData;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Overview of your incident management system
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Open Tickets"
                    value={stats.openTickets || 0}
                    icon={<AlertCircle className="text-amber-500" />}
                />
                <StatsCard
                    title="Resolved"
                    value={stats.resolvedTickets || 0}
                    icon={<CheckCircle2 className="text-green-500" />}
                />
                <StatsCard
                    title="High Priority"
                    value={stats.highPriorityTickets || 0}
                    icon={<Clock className="text-red-500" />}
                />
                <StatsCard
                    title="Active Agents"
                    value={stats.activeAgents || 0}
                    icon={<UserCog className="text-indigo-500" />}
                />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium mb-4 text-gray-900">Ticket Trends</h2>
                    <TicketChart data={ticketTrends} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium mb-4 text-gray-900">Priority Distribution</h2>
                    <PriorityDistribution data={priorityDistribution} />
                </div>
            </div>

            {/* Tickets Recientes */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Recent Tickets</h2>
                    <a
                        href="/tickets"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                        View all
                    </a>
                </div>
                <RecentTickets data={recentTickets} />
            </div>
        </div>
    );
}

export default AdminDashboard;