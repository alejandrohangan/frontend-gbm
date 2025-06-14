import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AdminDashboard from './AdminDashboard';
import UserTickets from './UserTickets';
import { Navigate } from 'react-router-dom';

function Dashboard() {
  const { authUser } = useAuth();
  
  // Si no hay usuario autenticado, redirigir al login
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario es admin, mostrar AdminDashboard
  if (authUser.role === 'admin') {
    return <AdminDashboard />;
  }

  // Para cualquier otro rol, mostrar UserTickets
  return <UserTickets />;
}

export default Dashboard