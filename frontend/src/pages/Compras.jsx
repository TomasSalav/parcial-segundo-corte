// pages/Compras.jsx — CRUD de Compras
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { Plus, Pencil, Trash2, Search, ShoppingCart } from 'lucide-react';

const EMPTY = { dni_cliente: '', matricula: '', fecha_compra: new Date().toISOString().split('T')[0] };

export default function Compras() {
  const { user } = useAuth();
  const canDelete = ['admin', 'moderador'].includes(user?.rol);
  const [data,     setData]     = useState([]);
  const [clientes, setClientes] = useState([]);
  const [coches,   setCoches]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [editing,  setEditing]  = useState(null);

  const cargar = async () => {
    try {
      const [co, cl, ca] = await Promise.all([api.get('/compras'), api.get('/clientes'), api.get('/coches')]);
      setData(co.data.data); setClientes(cl.data.data); setCoches(ca.data.data);
    } catch { Swal.fire('Error', 'No se pudieron cargar las compras.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargar(); }, []);

  const filtrados = data.filter(c =>
    `${c.nombre_cliente} ${c.apellido_cliente} ${c.matricula} ${c.marca}`.toLowerCase().includes(search.toLowerCase())
  );

  const abrirCrear  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const abrirEditar = (c) => {
    setForm({ dni_cliente: c.dni_cliente, matricula: c.matricula,
              fecha_compra: c.fecha_compra?.split('T')[0] ?? '' });
    setEditing(c.id_compra); setModal(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/compras/${editing}`, form); }
      else         { await api.post('/compras', form); }
      Swal.fire({ icon: 'success', title: editing ? 'Actualizado' : 'Compra registrada',
        timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#f1f5f9' });
      setModal(false); cargar();
    } catch (err) { Swal.fire('Error', err.response?.data?.message ?? 'Error.', 'error'); }
  };

  const eliminar = async (c) => {
    const res = await Swal.fire({
      title: '¿Eliminar compra?', text: '¿Seguro? Esta acción no se puede deshacer.',
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar', background: '#1e293b', color: '#f1f5f9'
    });
    if (!res.isConfirmed) return;
    try {
      await api.delete(`/compras/${c.id_compra}`);
      Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#f1f5f9' });
      cargar();
    } catch (err) { Swal.fire('Error', err.response?.data?.message ?? 'No se pudo eliminar.', 'error'); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart size={28} className="text-purple-400" />
          <div><h1 className="text-2xl font-bold text-white">Compras</h1>
            <p className="text-slate-400 text-sm">{data.length} transacciones</p></div>
        </div>
        <button onClick={abrirCrear} className="btn-primary"><Plus size={18} /> Registrar compra</button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="input-field pl-10" placeholder="Buscar por cliente, matrícula o marca..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr>
              <th className="table-header">ID</th>
              <th className="table-header">Cliente</th>
              <th className="table-header">Coche</th>
              <th className="table-header">Fecha</th>
              <th className="table-header">Acciones</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="table-cell text-center py-8 text-slate-400">Cargando...</td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={5} className="table-cell text-center py-8 text-slate-500">No hay compras registradas.</td></tr>
              ) : filtrados.map(c => (
                <tr key={c.id_compra} className="hover:bg-slate-700/50 transition-colors">
                  <td className="table-cell font-mono text-slate-400">{c.id_compra}</td>
                  <td className="table-cell">
                    <p className="text-white font-medium">{c.nombre_cliente} {c.apellido_cliente}</p>
                    <p className="text-slate-400 text-xs">{c.telefono}</p>
                  </td>
                  <td className="table-cell">
                    <p className="font-mono text-blue-400">{c.matricula}</p>
                    <p className="text-slate-400 text-xs">{c.marca} {c.modelo} · {c.color}</p>
                  </td>
                  <td className="table-cell text-slate-300">{c.fecha_compra?.split('T')[0]}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button onClick={() => abrirEditar(c)} className="p-1.5 rounded-lg bg-blue-900/40 text-blue-400 hover:bg-blue-700 hover:text-white transition-colors"><Pencil size={15} /></button>
                      {canDelete && <button onClick={() => eliminar(c)} className="p-1.5 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-700 hover:text-white transition-colors"><Trash2 size={15} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-5">{editing ? 'Editar compra' : 'Registrar compra'}</h2>
            <form onSubmit={guardar} className="space-y-4">
              <div><label className="label">Cliente</label>
                <select className="input-field" value={form.dni_cliente} onChange={e => setForm({...form, dni_cliente: e.target.value})} required>
                  <option value="">-- Seleccionar cliente --</option>
                  {clientes.map(c => <option key={c.dni_cliente} value={c.dni_cliente}>{c.nombre_cliente} {c.apellido_cliente}</option>)}
                </select>
              </div>
              <div><label className="label">Coche</label>
                <select className="input-field" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} required>
                  <option value="">-- Seleccionar coche --</option>
                  {coches.map(c => <option key={c.matricula} value={c.matricula}>{c.matricula} — {c.marca} {c.modelo}</option>)}
                </select>
              </div>
              <div><label className="label">Fecha de compra</label>
                <input type="date" className="input-field" value={form.fecha_compra} onChange={e => setForm({...form, fecha_compra: e.target.value})} required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button type="submit" className="btn-primary flex-1 justify-center">{editing ? 'Guardar cambios' : 'Registrar compra'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
