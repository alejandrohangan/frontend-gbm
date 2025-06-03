import React, { useEffect, useState } from 'react';
import DashboardService from '../../services/DashboardService';
import StatsCard from '../../components/dashboard/StatsCard';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    Loader2
} from 'lucide-react';
import { PriorityDistribution } from '../../components/dashboard/PriorityDistribution';
import { CategoryDistribution } from '../../components/dashboard/CategoryDistribution';
import RecentTickets from '../../components/dashboard/RecentTickets';

function AdminDashboard() {
    const [dashboardData, setDashboardData] = useState({
        stats: {},
        priorityDistribution: [],
        categoryDistribution: [],
        recentTickets: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await DashboardService.getData();
            console.log(response);

            if (response) {
                setDashboardData({
                    stats: response.stats || {},
                    priorityDistribution: response.priorityDistribution || [],
                    categoryDistribution: response.categoryDistribution || [],
                    recentTickets: response.recentTickets || []
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

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '16rem' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center" role="alert">
                {error}
            </div>
        );
    }

    const { stats, ticketTrends, priorityDistribution, categoryDistribution, recentTickets } = dashboardData;

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h1 className="h2 fw-bold text-dark">Dashboard</h1>
                <p className="text-muted small mb-0">
                    Overview of your incident management system
                </p>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-sm-6 col-lg-3">
                    <StatsCard
                        title="Open Tickets"
                        value={stats.openTickets || 0}
                        icon={<AlertCircle className="text-warning" />}
                    />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <StatsCard
                        title="Closed"
                        value={stats.closedTickets || 0}
                        icon={<CheckCircle2 className="text-success" />}
                    />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <StatsCard
                        title="High Priority"
                        value={stats.highPriorityTickets || 0}
                        icon={<Clock className="text-danger" />}
                    />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <StatsCard
                        title="In Progress"
                        value={stats.inProgressTickets || 0}
                        icon={<Loader2 className="text-primary" />}
                    />
                </div>
            </div>

            {/* Charts Row */}
            <div className="row g-4">
                <div className="col-12 col-lg-6">
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column" style={{ minHeight: '20rem' }}>
                            <h5 className="card-title mb-4">Priority Distribution</h5>
                            <PriorityDistribution priorityData={priorityDistribution} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column" style={{ minHeight: '20rem' }}>
                            <h5 className="card-title mb-4">Category Distribution</h5>
                            <CategoryDistribution categoryData={categoryDistribution} />
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0">Recent Tickets</h5>
                                <a href="/tickets" className="text-decoration-none">View all</a>
                            </div>
                            <RecentTickets recentTickets={dashboardData.recentTickets} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;