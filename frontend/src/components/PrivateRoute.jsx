// components/PrivateRoute.jsx — Protege rutas que requieren autenticación
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Si se especifican roles y el usuario no tiene el rol requerido
  if (roles && !roles.includes(user.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
