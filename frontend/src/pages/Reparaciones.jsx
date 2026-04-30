// pages/Reparaciones.jsx — CRUD de Reparaciones
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { Plus, Pencil, Trash2, Search, Settings } from 'lucide-react';

const EMPTY = { dni_mecanico: '', matricula: '', fecha_reparacion: '', horas_reparacion: '' };

export default function Reparaciones() {
  const { user } = useAuth();
  const canDelete = ['admin', 'moderador'].includes(user?.rol);
  const [data,      setData]      = useState([]);
  const [mecanicos, setMecanicos] = useState([]);
  const [coches,    setCoches]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState(EMPTY);
  const [editing,   setEditing]   = useState(null);

  const cargar = async () => {
    try {
      const [r, m, c] = await Promise.all([
        api.get('/reparaciones'), api.get('/mecanicos'), api.get('/coches')
      ]);
      setData(r.data.data); setMecanicos(m.data.data); setCoches(c.data.data);
    } catch { Swal.fire('Error', 'No se pudieron cargar los datos.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargar(); }, []);

  const filtrados = data.filter(r =>
    `${r.nombre_mecanico} ${r.apellido_mecanico} ${r.matricula}`.toLowerCase().includes(search.toLowerCase())
  );

  const abrirCrear  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const abrirEditar = (r) => {
    setForm({ dni_mecanico: r.dni_mecanico, matricula: r.matricula,
              fecha_reparacion: r.fecha_reparacion?.split('T')[0] ?? '',
              horas_reparacion: r.horas_reparacion });
    setEditing(r.id_reparacion); setModal(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/reparaciones/${editing}`, form); }
      else         { await api.post('/reparaciones', form); }
      Swal.fire({ icon: 'success', title: editing ? 'Actualizado' : 'Creado',
        timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#f1f5f9' });
      setModal(false); cargar();
    } catch (err) { Swal.fire('Error', err.response?.data?.message ?? 'Error.', 'error'); }
  };

  const eliminar = async (r) => {
    const res = await Swal.fire({
      title: '¿Eliminar reparación?', text: 'Esta acción no se puede deshacer.',
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar', background: '#1e293b', color: '#f1f5f9'
    });
    if (!res.isConfirmed) return;
    try {
      await api.delete(`/reparaciones/${r.id_reparacion}`);
      Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#f1f5f9' });
      cargar();
    } catch (err) { Swal.fire('Error', err.response?.data?.message ?? 'No se pudo eliminar.', 'error'); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings size={28} className="text-rose-400" />
          <div><h1 className="text-2xl font-bold text-white">Reparaciones</h1>
            <p className="text-slate-400 text-sm">{data.length} registros</p></div>
        </div>
        <button onClick={abrirCrear} className="btn-primary"><Plus size={18} /> Nueva reparación</button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="input-field pl-10" placeholder="Buscar por mecánico o matrícula..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr>
              <th className="table-header">ID</th>
              <th className="table-header">Mecánico</th>
              <th className="table-header">Coche</th>
              <th className="table-header">Fecha</th>
              <th className="table-header">Horas</th>
              <th className="table-header">Acciones</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="table-cell text-center py-8 text-slate-400">Cargando...</td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={6} className="table-cell text-center py-8 text-slate-500">No hay reparaciones.</td></tr>
              ) : filtrados.map(r => (
                <tr key={r.id_reparacion} className="hover:bg-slate-700/50 transition-colors">
                  <td className="table-cell font-mono text-slate-400">{r.id_reparacion}</td>
                  <td className="table-cell text-white">{r.nombre_mecanico} {r.apellido_mecanico}</td>
                  <td className="table-cell">
                    <p className="font-mono text-blue-400">{r.matricula}</p>
                    <p className="text-slate-400 text-xs">{r.marca} {r.modelo}</p>
                  </td>
                  <td className="table-cell text-slate-300">{r.fecha_reparacion?.split('T')[0]}</td>
                  <td className="table-cell">
                    <span className="bg-rose-900/50 text-rose-300 px-2 py-0.5 rounded text-xs font-medium">
                      {r.horas_reparacion}h
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button onClick={() => abrirEditar(r)} className="p-1.5 rounded-lg bg-blue-900/40 text-blue-400 hover:bg-blue-700 hover:text-white transition-colors"><Pencil size={15} /></button>
                      {canDelete && <button onClick={() => eliminar(r)} className="p-1.5 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-700 hover:text-white transition-colors"><Trash2 size={15} /></button>}
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
            <h2 className="text-xl font-bold text-white mb-5">{editing ? 'Editar reparación' : 'Nueva reparación'}</h2>
            <form onSubmit={guardar} className="space-y-4">
              <div><label className="label">Mecánico</label>
                <select className="input-field" value={form.dni_mecanico} onChange={e => setForm({...form, dni_mecanico: e.target.value})} required>
                  <option value="">-- Seleccionar mecánico --</option>
                  {mecanicos.map(m => <option key={m.dni_mecanico} value={m.dni_mecanico}>{m.nombre_mecanico} {m.apellido_mecanico}</option>)}
                </select>
              </div>
              <div><label className="label">Coche</label>
                <select className="input-field" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} required>
                  <option value="">-- Seleccionar coche --</option>
                  {coches.map(c => <option key={c.matricula} value={c.matricula}>{c.matricula} — {c.marca} {c.modelo}</option>)}
                </select>
              </div>
              <div><label className="label">Fecha de reparación</label>
                <input type="date" className="input-field" value={form.fecha_reparacion} onChange={e => setForm({...form, fecha_reparacion: e.target.value})} required />
              </div>
              <div><label className="label">Horas de reparación</label>
                <input type="number" min="1" className="input-field" value={form.horas_reparacion} onChange={e => setForm({...form, horas_reparacion: e.target.value})} required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button type="submit" className="btn-primary flex-1 justify-center">{editing ? 'Guardar cambios' : 'Crear reparación'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
