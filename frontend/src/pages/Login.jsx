// pages/Login.jsx — Página de inicio de sesión
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';
import Swal from 'sweetalert2';
import { Car, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [form,        setForm]        = useState({ usuario: '', password: '' });
  const [loading,     setLoading]     = useState(false);
  const [showPass,    setShowPass]    = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.usuario || !form.password) {
      Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Ingresa usuario y contraseña.', background: '#1e293b', color: '#f1f5f9' });
      return;
    }
    setLoading(true);
    try {
      const { data } = await login(form.usuario, form.password);
      loginUser(data.token, { usuario: data.usuario, rol: data.rol, imagen: data.imagen });
      Swal.fire({ icon: 'success', title: '¡Bienvenido!', text: `Hola, ${data.usuario}`, timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#f1f5f9' });
      navigate('/dashboard');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: err.response?.data?.message ?? 'Error del servidor.',
        background: '#1e293b',
        color: '#f1f5f9',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <Car size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Concesionario</h1>
          <p className="text-slate-400 mt-1">Sistema de gestión de vehículos</p>
          <p className="text-slate-500 text-xs mt-1">Universidad Libre · Pereira · 2026-1</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Iniciar sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Usuario</label>
              <input
                id="input-usuario"
                name="usuario"
                type="text"
                className="input-field"
                placeholder="Ingresa tu usuario"
                value={form.usuario}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <div className="relative">
                <input
                  id="input-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              id="btn-login"
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 text-base">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Ingresando...
                </span>
              ) : 'Iniciar sesión'}
            </button>
          </form>
          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg text-xs text-slate-400">
            <p className="font-medium text-slate-300 mb-1">Cuenta de prueba:</p>
            <p>Usuario: <span className="text-blue-400">admin</span> · Contraseña: <span className="text-blue-400">password</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
