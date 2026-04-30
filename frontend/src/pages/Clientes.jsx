// pages/Clientes.jsx — CRUD completo de Clientes con SweetAlert2
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { Plus, Pencil, Trash2, Search, Users } from 'lucide-react';

const EMPTY = { nombre_cliente: '', apellido_cliente: '', direccion: '', telefono: '' };

export default function Clientes() {
  const { user } = useAuth();
  const canDelete = ['admin', 'moderador'].includes(user?.rol);

  const [clientes, setClientes] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [editing,  setEditing]  = useState(null); // dni del cliente editado

  const cargar = async () => {
    try {
      const { data } = await api.get('/clientes');
      setClientes(data.data);
    } catch { Swal.fire('Error', 'No se pudieron cargar los clientes.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargar(); }, []);

  const filtrados = clientes.filter(c =>
    `${c.nombre_cliente} ${c.apellido_cliente} ${c.telefono}`.toLowerCase().includes(search.toLowerCase())
  );

  const abrirCrear = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const abrirEditar = (c) => {
    setForm({ nombre_cliente: c.nombre_cliente, apellido_cliente: c.apellido_cliente, direccion: c.direccion, telefono: c.telefono });
    setEditing(c.dni_cliente);
    setModal(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/clientes/${editing}`, form);
        Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Cliente actualizado correctamente.', timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#f1f5f9' });
      } else {
        await api.post('/clientes', form);
        Swal.fire({ icon: 'success', title: 'Creado', text: 'Cliente creado correctamente.', timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#f1f5f9' });
      }
      setModal(false);
      cargar();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message ?? 'Error al guardar.', 'error');
    }
  };

  const eliminar = async (c) => {
    const result = await Swal.fire({
      title: '¿Eliminar cliente?',
      text: `¿Seguro que deseas eliminar a ${c.nombre_cliente} ${c.apellido_cliente}? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1e293b',
      color: '#f1f5f9',
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/clientes/${c.dni_cliente}`);
      Swal.fire({ icon: 'success', title: 'Eliminado', text: 'El cliente fue eliminado.', timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#f1f5f9' });
      cargar();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message ?? 'No se pudo eliminar.', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={28} className="text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Clientes</h1>
            <p className="text-slate-400 text-sm">{clientes.length} registros</p>
          </div>
        </div>
        <button id="btn-nuevo-cliente" onClick={abrirCrear} className="btn-primary">
          <Plus size={18} /> Nuevo cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="input-field pl-10" placeholder="Buscar por nombre o teléfono..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">DNI</th>
                <th className="table-header">Nombre</th>
                <th className="table-header">Dirección</th>
                <th className="table-header">Teléfono</th>
                <th className="table-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="table-cell text-center py-8 text-slate-400">Cargando...</td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={5} className="table-cell text-center py-8 text-slate-500">No hay clientes registrados.</td></tr>
              ) : filtrados.map(c => (
                <tr key={c.dni_cliente} className="hover:bg-slate-700/50 transition-colors">
                  <td className="table-cell font-mono text-slate-400">{c.dni_cliente}</td>
                  <td className="table-cell font-medium text-white">{c.nombre_cliente} {c.apellido_cliente}</td>
                  <td className="table-cell text-slate-300">{c.direccion}</td>
                  <td className="table-cell text-slate-300">{c.telefono}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button onClick={() => abrirEditar(c)} className="p-1.5 rounded-lg bg-blue-900/40 text-blue-400 hover:bg-blue-700 hover:text-white transition-colors">
                        <Pencil size={15} />
                      </button>
                      {canDelete && (
                        <button onClick={() => eliminar(c)} className="p-1.5 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-700 hover:text-white transition-colors">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-5">{editing ? 'Editar cliente' : 'Nuevo cliente'}</h2>
            <form onSubmit={guardar} className="space-y-4">
              <div>
                <label className="label">Nombre</label>
                <input className="input-field" value={form.nombre_cliente} onChange={e => setForm({...form, nombre_cliente: e.target.value})} required />
              </div>
              <div>
                <label className="label">Apellido</label>
                <input className="input-field" value={form.apellido_cliente} onChange={e => setForm({...form, apellido_cliente: e.target.value})} required />
              </div>
              <div>
                <label className="label">Dirección</label>
                <input className="input-field" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} required />
              </div>
              <div>
                <label className="label">Teléfono</label>
                <input className="input-field" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  {editing ? 'Guardar cambios' : 'Crear cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
