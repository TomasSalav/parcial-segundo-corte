// pages/Mecanicos.jsx — CRUD completo de Mecánicos
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { Plus, Pencil, Trash2, Search, Wrench } from 'lucide-react';

const EMPTY = { nombre_mecanico: '', apellido_mecanico: '', fecha_contratacion: '', salario: '' };

export default function Mecanicos() {
  const { user } = useAuth();
  const canDelete = ['admin', 'moderador'].includes(user?.rol);
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editing, setEditing] = useState(null);

  const cargar = async () => {
    try { const res = await api.get('/mecanicos'); setData(res.data.data); }
    catch { Swal.fire('Error', 'No se pudieron cargar los mecánicos.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargar(); }, []);

  const filtrados = data.filter(m =>
    `${m.nombre_mecanico} ${m.apellido_mecanico}`.toLowerCase().includes(search.toLowerCase())
  );

  const abrirCrear  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const abrirEditar = (m) => {
    setForm({ nombre_mecanico: m.nombre_mecanico, apellido_mecanico: m.apellido_mecanico,
              fecha_contratacion: m.fecha_contratacion?.split('T')[0] ?? '', salario: m.salario });
    setEditing(m.dni_mecanico); setModal(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      editing ? await api.put(`/mecanicos/${editing}`, form) : await api.post('/mecanicos', form);
      Swal.fire({ icon: 'success', title: editing ? 'Actualizado' : 'Creado', timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#f1f5f9' });
      setModal(false); cargar();
    } catch (err) { Swal.fire('Error', err.response?.data?.message ?? 'Error.', 'error'); }
  };

  const eliminar = async (m) => {
    const r = await Swal.fire({ title: '¿Eliminar mecánico?', text: `¿Eliminar a ${m.nombre_mecanico} ${m.apellido_mecanico}?`, icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar', background: '#1e293b', color: '#f1f5f9' });
    if (!r.isConfirmed) return;
    try { await api.delete(`/mecanicos/${m.dni_mecanico}`);
      Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#f1f5f9' });
      cargar();
    } catch (err) { Swal.fire('Error', err.response?.data?.message ?? 'No se pudo eliminar.', 'error'); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench size={28} className="text-amber-400" />
          <div><h1 className="text-2xl font-bold text-white">Mecánicos</h1>
            <p className="text-slate-400 text-sm">{data.length} registros</p></div>
        </div>
        <button onClick={abrirCrear} className="btn-primary"><Plus size={18} /> Nuevo mecánico</button>
      </div>
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="input-field pl-10" placeholder="Buscar por nombre..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr>
              <th className="table-header">DNI</th>
              <th className="table-header">Nombre</th>
              <th className="table-header">F. Contratación</th>
              <th className="table-header">Salario</th>
              <th className="table-header">Acciones</th>
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={5} className="table-cell text-center py-8 text-slate-400">Cargando...</td></tr>
              : filtrados.length === 0 ? <tr><td colSpan={5} className="table-cell text-center py-8 text-slate-500">No hay mecánicos.</td></tr>
              : filtrados.map(m => (
                <tr key={m.dni_mecanico} className="hover:bg-slate-700/50 transition-colors">
                  <td className="table-cell font-mono text-slate-400">{m.dni_mecanico}</td>
                  <td className="table-cell font-medium text-white">{m.nombre_mecanico} {m.apellido_mecanico}</td>
                  <td className="table-cell text-slate-300">{m.fecha_contratacion?.split('T')[0]}</td>
                  <td className="table-cell text-emerald-400 font-medium">${Number(m.salario).toLocaleString()}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button onClick={() => abrirEditar(m)} className="p-1.5 rounded-lg bg-blue-900/40 text-blue-400 hover:bg-blue-700 hover:text-white transition-colors"><Pencil size={15} /></button>
                      {canDelete && <button onClick={() => eliminar(m)} className="p-1.5 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-700 hover:text-white transition-colors"><Trash2 size={15} /></button>}
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
            <h2 className="text-xl font-bold text-white mb-5">{editing ? 'Editar mecánico' : 'Nuevo mecánico'}</h2>
            <form onSubmit={guardar} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Nombre</label><input className="input-field" value={form.nombre_mecanico} onChange={e => setForm({...form, nombre_mecanico: e.target.value})} required /></div>
                <div><label className="label">Apellido</label><input className="input-field" value={form.apellido_mecanico} onChange={e => setForm({...form, apellido_mecanico: e.target.value})} required /></div>
              </div>
              <div><label className="label">Fecha de contratación</label><input type="date" className="input-field" value={form.fecha_contratacion} onChange={e => setForm({...form, fecha_contratacion: e.target.value})} required /></div>
              <div><label className="label">Salario (COP)</label><input type="number" min="0" className="input-field" value={form.salario} onChange={e => setForm({...form, salario: e.target.value})} required /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button type="submit" className="btn-primary flex-1 justify-center">{editing ? 'Guardar cambios' : 'Crear mecánico'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
