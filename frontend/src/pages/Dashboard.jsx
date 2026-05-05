// pages/Dashboard.jsx — Dashboard principal con estadísticas (RF-02)
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStats } from '../services/authService';
import { Users, Car, ShoppingCart, Wrench, Settings, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, desc }) => (
  <div className="card flex items-start gap-4 hover:scale-105 transition-transform duration-200">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-3xl font-bold text-white mt-0.5">{value ?? '—'}</p>
      {desc && <p className="text-slate-500 text-xs mt-1">{desc}</p>}
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const roleBadge = {
    admin:     'bg-purple-800 text-purple-200',
    moderador: 'bg-blue-800   text-blue-200',
    usuario:   'bg-slate-600  text-slate-200',
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Bienvenido, {user?.usuario}
          </h1>
          <p className="text-slate-400 mt-1">Panel de control — Concesionario de Coches</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleBadge[user?.rol] ?? roleBadge.usuario}`}>
          {user?.rol}
        </span>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-slate-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Clientes registrados"  value={stats?.totalClientes}    icon={Users}       color="bg-blue-600"    desc="Total de clientes en el sistema" />
          <StatCard title="Coches en catálogo"    value={stats?.totalCoches}      icon={Car}         color="bg-emerald-600" desc="Nuevos y usados" />
          <StatCard title="Compras realizadas"    value={stats?.totalCompras}     icon={ShoppingCart} color="bg-purple-600"  desc="Transacciones registradas" />
          <StatCard title="Mecánicos activos"     value={stats?.totalMecanicos}   icon={Wrench}      color="bg-amber-600"   desc="Personal del taller" />
          <StatCard title="Reparaciones"          value={stats?.totalReparaciones} icon={Settings}   color="bg-rose-600"    desc="Servicios realizados" />
          <div className="card flex items-center gap-4 bg-gradient-to-br from-blue-900/60 to-slate-800 border-blue-700/50">
            <TrendingUp size={40} className="text-blue-400" />
            <div>
              <p className="text-slate-400 text-sm">Sistema operativo</p>
              <p className="text-white font-semibold mt-0.5">Todo funcionando</p>
              <p className="text-blue-400 text-xs mt-1">React · Express · MySQL</p>
            </div>
          </div>
        </div>
      )}

      {/* Info del usuario */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Información del usuario</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-400">Usuario</p>
            <p className="text-white font-medium mt-0.5">{user?.usuario}</p>
          </div>
          <div>
            <p className="text-slate-400">Rol</p>
            <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge[user?.rol]}`}>
              {user?.rol}
            </span>
          </div>
          <div>
            <p className="text-slate-400">Permisos</p>
            <p className="text-white font-medium mt-0.5">
              {user?.rol === 'admin' ? 'Acceso total' : user?.rol === 'moderador' ? 'Lectura + Edición' : 'Lectura + Creación'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
