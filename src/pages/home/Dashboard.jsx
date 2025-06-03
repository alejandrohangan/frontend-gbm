import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AdminDashboard from './AdminDashboard';
import UserTickets from './UserTickets';

function Dashboard() {
  const { authUser } = useAuth();
  
  return (
    <>
      {authUser?.role === 'admin' ? <AdminDashboard /> : <UserTickets />}
    </>
  );
}

export default Dashboard