// App.jsx — Configuración de rutas principales de la aplicación
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Coches from './pages/Coches';
import Mecanicos from './pages/Mecanicos';
import Reparaciones from './pages/Reparaciones';
import Compras from './pages/Compras';

// Layout base con Navbar para las rutas privadas
const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-slate-900">
    <Navbar />
    <main className="flex-1 max-h-screen overflow-y-auto bg-slate-900/50">
      {children}
    </main>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas privadas */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/clientes" element={
            <PrivateRoute>
              <Layout><Clientes /></Layout>
            </PrivateRoute>
          } />

          <Route path="/coches" element={
            <PrivateRoute>
              <Layout><Coches /></Layout>
            </PrivateRoute>
          } />

          <Route path="/mecanicos" element={
            <PrivateRoute>
              <Layout><Mecanicos /></Layout>
            </PrivateRoute>
          } />

          <Route path="/reparaciones" element={
            <PrivateRoute>
              <Layout><Reparaciones /></Layout>
            </PrivateRoute>
          } />

          <Route path="/compras" element={
            <PrivateRoute>
              <Layout><Compras /></Layout>
            </PrivateRoute>
          } />

          {/* Catch all para rutas no encontradas */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
