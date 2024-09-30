import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function PrivateRoute({ children, requiredRole }) {
  const { currentUser, userRole } = useAuth();

  // Verificar se o usuário está autenticado e se tem o papel necessário
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" />; // Redireciona para o dashboard se o papel não corresponder
  }

  return children;
}

export default PrivateRoute;
