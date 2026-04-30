// pages/Coches.jsx — CRUD completo de Coches (nuevo/usado)
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { Plus, Pencil, Trash2, Search, Car } from 'lucide-react';

const EMPTY = { matricula: '', modelo: '', marca: '', color: '', tipo: 'nuevo', unidades_disponibles: 1, kilometraje: 0 };

export default function Coches() {
  const { user } = useAuth();
  const canDelete = ['admin', 'moderador'].includes(user?.rol);

  const [coches,  setCoches]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editing, setEditing] = useState(null);

  const cargar = async () => {
    try {
      const { data } = await api.get('/coches');
      setCoches(data.data);
    } catch { Swal.fire('Error', 'No se pudieron cargar los coches.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargar(); }, []);

  const filtrados = coches.filter(c =>
    `${c.matricula} ${c.marca} ${c.modelo} ${c.color}`.toLowerCase().includes(search.toLowerCase())
  );

  const abrirCrear  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const abrirEditar = (c) => {
    setForm({ matricula: c.matricula, modelo: c.modelo, marca: c.marca, color: c.color,
              tipo: c.tipo, unidades_disponibles: c.unidades_disponibles ?? 1, kilometraje: c.kilometraje ?? 0 });
    setEditing(c.matricula);
    setModal(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/coches/${editing}`, form);
        Swal.fire({ icon: 'success', title: 'Actualizado', timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#f1f5f9' });
      } else {
        await api.post('/coches', form);
        Swal.fire({ icon: 'success', title: 'Coche creado', timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#f1f5f9' });
      }
      setModal(false);
      cargar();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message ?? 'Error al guardar.', 'error');
    }
  };

  const eliminar = async (c) => {
    const result = await Swal.fire({
      title: '¿Eliminar coche?',
      text: `¿Eliminar ${c.marca} ${c.modelo} (${c.matricula})?`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
      background: '#1e293b', color: '#f1f5f9',
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/coches/${c.matricula}`);
      Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#f1f5f9' });
      cargar();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message ?? 'No se pudo eliminar.', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Car size={28} className="text-emerald-400" />
          <div><h1 className="text-2xl font-bold text-white">Coches</h1>
            <p className="text-slate-400 text-sm">{coches.length} vehículos</p></div>
        </div>
        <button onClick={abrirCrear} className="btn-success"><Plus size={18} /> Nuevo coche</button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="input-field pl-10" placeholder="Buscar por matrícula, marca, modelo..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr>
              <th className="table-header">Matrícula</th>
              <th className="table-header">Marca / Modelo</th>
              <th className="table-header">Color</th>
              <th className="table-header">Tipo</th>
              <th className="table-header">Info</th>
              <th className="table-header">Acciones</th>
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="table-cell text-center py-8 text-slate-400">Cargando...</td></tr>
              : filtrados.length === 0 ? <tr><td colSpan={6} className="table-cell text-center py-8 text-slate-500">No hay coches.</td></tr>
              : filtrados.map(c => (
                <tr key={c.matricula} className="hover:bg-slate-700/50 transition-colors">
                  <td className="table-cell font-mono font-medium text-blue-400">{c.matricula}</td>
                  <td className="table-cell"><p className="font-medium text-white">{c.marca}</p><p className="text-slate-400 text-xs">{c.modelo}</p></td>
                  <td className="table-cell text-slate-300">{c.color}</td>
                  <td className="table-cell">
                    <span className={c.tipo === 'nuevo' ? 'badge-nuevo' : 'badge-usado'}>
                      {c.tipo === 'nuevo' ? 'Nuevo' : 'Usado'}
                    </span>
                  </td>
                  <td className="table-cell text-slate-400 text-xs">
                    {c.tipo === 'nuevo' ? `${c.unidades_disponibles} unidades` : `${c.kilometraje?.toLocaleString()} km`}
                  </td>
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
            <h2 className="text-xl font-bold text-white mb-5">{editing ? 'Editar coche' : 'Nuevo coche'}</h2>
            <form onSubmit={guardar} className="space-y-4">
              {!editing && (
                <div><label className="label">Matrícula</label>
                  <input className="input-field" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} placeholder="Ej: ABC-001" required /></div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Marca</label><input className="input-field" value={form.marca} onChange={e => setForm({...form, marca: e.target.value})} required /></div>
                <div><label className="label">Modelo</label><input className="input-field" value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})} required /></div>
              </div>
              <div><label className="label">Color</label><input className="input-field" value={form.color} onChange={e => setForm({...form, color: e.target.value})} required /></div>
              <div><label className="label">Tipo</label>
                <select className="input-field" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                </select>
              </div>
              {form.tipo === 'nuevo'
                ? <div><label className="label">Unidades disponibles</label><input type="number" min="0" className="input-field" value={form.unidades_disponibles} onChange={e => setForm({...form, unidades_disponibles: +e.target.value})} /></div>
                : <div><label className="label">Kilometraje</label><input type="number" min="0" className="input-field" value={form.kilometraje} onChange={e => setForm({...form, kilometraje: +e.target.value})} /></div>
              }
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button type="submit" className="btn-success flex-1 justify-center">{editing ? 'Guardar cambios' : 'Crear coche'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
