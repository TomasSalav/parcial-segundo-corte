// components/Navbar.jsx — Barra de navegación con menú lateral
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Car, Wrench, ShoppingCart, Settings, LogOut, Menu, X, UserCircle
} from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/clientes',     label: 'Clientes',     icon: Users },
  { to: '/coches',       label: 'Coches',       icon: Car },
  { to: '/mecanicos',    label: 'Mecánicos',    icon: Wrench },
  { to: '/reparaciones', label: 'Reparaciones', icon: Settings },
  { to: '/compras',      label: 'Compras',      icon: ShoppingCart },
];

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro que deseas salir del sistema?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      background: '#1e293b',
      color: '#f1f5f9',
    });
    if (result.isConfirmed) {
      logoutUser();
      navigate('/login');
    }
  };

  const roleBadge = {
    admin:      'bg-purple-800 text-purple-200',
    moderador:  'bg-blue-800 text-blue-200',
    usuario:    'bg-slate-600 text-slate-200',
  };

  return (
    <aside className={`${open ? 'w-64' : 'w-16'} bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 min-h-screen`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {open && <span className="text-blue-400 font-bold text-lg">🚗 Concesionario</span>}
        <button onClick={() => setOpen(!open)} className="text-slate-400 hover:text-white transition-colors">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* User info */}
      {open && user && (
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-lg">
              {user.usuario?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="text-white font-medium text-sm truncate">{user.usuario}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadge[user.rol] ?? roleBadge.usuario}`}>
                {user.rol}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                ${active ? 'bg-blue-700 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
              <Icon size={18} />
              {open && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-slate-700">
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors">
          <LogOut size={18} />
          {open && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
