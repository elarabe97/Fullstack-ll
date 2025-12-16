import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../lib/api';

const emptyForm = { code: '', name: '', category: '', price: '', img: '', stock: '' };

export default function AdminPanel() {
    const navigate = useNavigate();
    const { user } = useUser();

    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    // Estado local “resuelto” para el rol (evita que te eche por false antes de cargar el contexto)
    const [auth, setAuth] = useState({ checked: false, isAdmin: false, token: null });

    // Lee rápido desde localStorage para saber si es admin SIN depender del timing del Context
    useEffect(() => {
        const stored = localStorage.getItem('lug_user');
        if (!stored) {
            setAuth({ checked: true, isAdmin: false, token: null });
            return;
        }
        try {
            const u = JSON.parse(stored);
            setAuth({
                checked: true,
                isAdmin: u?.role === 'ADMIN',
                token: u?.token ?? null,
            });
        } catch {
            setAuth({ checked: true, isAdmin: false, token: null });
        }
    }, []);

    // ✅ CAMBIO #1: Redirección segura (solo cuando ya está “checked”)
    useEffect(() => {
        if (auth.checked && auth.isAdmin === false) navigate('/');
    }, [auth.checked, auth.isAdmin, navigate]);

    const token = user?.token || auth.token;

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
        } catch (e) {
            console.error(e);
            setMsg({ type: 'err', text: 'No se pudieron cargar productos.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setIsEditing(false);
    };

    const validate = () => {
        if (!form.code?.trim()) return 'Código obligatorio.';
        if (!form.name?.trim()) return 'Nombre obligatorio.';
        if (!form.category?.trim()) return 'Categoría obligatoria.';
        if (form.price === '' || Number.isNaN(Number(form.price))) return 'Precio inválido.';
        if (form.stock === '' || Number.isNaN(Number(form.stock))) return 'Stock inválido.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);

        const err = validate();
        if (err) return setMsg({ type: 'err', text: err });

        const payload = {
            code: String(form.code).trim(),
            name: String(form.name).trim(),
            category: String(form.category).trim(),
            price: Number(form.price),
            img: String(form.img || '').trim(),
            stock: Number(form.stock),
        };

        if (!token) {
            setMsg({ type: 'err', text: 'No hay token. Inicia sesión como ADMIN.' });
            return;
        }

        try {
            setLoading(true);
            if (isEditing) {
                await updateProduct(payload.code, payload, token);
                setMsg({ type: 'ok', text: 'Producto actualizado ✅' });
            } else {
                await createProduct(payload, token);
                setMsg({ type: 'ok', text: 'Producto creado ✅' });
            }
            resetForm();
            await loadProducts();
        } catch (e2) {
            const status = e2?.response?.status;
            if (status === 401) setMsg({ type: 'err', text: '401: No autenticado. Vuelve a iniciar sesión.' });
            else if (status === 403) setMsg({ type: 'err', text: '403: Prohibido. Necesitas rol ADMIN.' });
            else setMsg({ type: 'err', text: 'Error guardando producto. Revisa backend/logs.' });
            console.error(e2);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (p) => {
        setMsg(null);
        setForm({
            code: p.code ?? '',
            name: p.name ?? '',
            category: p.category ?? '',
            price: p.price ?? '',
            img: p.img ?? '',
            stock: p.stock ?? '',
        });
        setIsEditing(true);
    };

    const handleDelete = async (code) => {
        setMsg(null);
        if (!window.confirm(`¿Eliminar producto ${code}?`)) return;

        // ✅ CAMBIO #2: check de token antes de eliminar
        if (!token) {
            setMsg({ type: 'err', text: 'No hay token. Inicia sesión como ADMIN.' });
            return;
        }

        try {
            setLoading(true);
            await deleteProduct(code, token);
            setMsg({ type: 'ok', text: 'Producto eliminado ✅' });
            await loadProducts();
        } catch (e) {
            const status = e?.response?.status;
            if (status === 401) setMsg({ type: 'err', text: '401: No autenticado. Vuelve a iniciar sesión.' });
            else if (status === 403) setMsg({ type: 'err', text: '403: Prohibido. Necesitas rol ADMIN.' });
            else setMsg({ type: 'err', text: 'Error eliminando producto.' });
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-orbitron font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-electric-blue">
                PANEL DE ADMINISTRACIÓN
            </h1>

            {msg && (
                <div
                    className={`mb-4 p-3 rounded border ${msg.type === 'ok' ? 'border-neon-green text-neon-green' : 'border-red-400 text-red-300'
                        }`}
                >
                    {msg.text}
                </div>
            )}

            <div className="glass-panel p-8 mb-8 shadow-neon-green">
                <h2 className="text-xl font-bold mb-6 font-orbitron text-neon-green">
                    {isEditing ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        name="code"
                        placeholder="Código"
                        value={form.code}
                        onChange={handleChange}
                        className="bg-black/50 border border-white/20 p-3 rounded text-white focus:border-neon-green outline-none"
                        disabled={isEditing}
                    />
                    <input
                        name="name"
                        placeholder="Nombre"
                        value={form.name}
                        onChange={handleChange}
                        className="bg-black/50 border border-white/20 p-3 rounded text-white focus:border-neon-green outline-none"
                    />
                    <input
                        name="category"
                        placeholder="Categoría"
                        value={form.category}
                        onChange={handleChange}
                        className="bg-black/50 border border-white/20 p-3 rounded text-white focus:border-neon-green outline-none"
                    />
                    <input
                        name="price"
                        type="number"
                        placeholder="Precio"
                        value={form.price}
                        onChange={handleChange}
                        className="bg-black/50 border border-white/20 p-3 rounded text-white focus:border-neon-green outline-none"
                    />
                    <input
                        name="stock"
                        type="number"
                        placeholder="Stock"
                        value={form.stock}
                        onChange={handleChange}
                        className="bg-black/50 border border-white/20 p-3 rounded text-white focus:border-neon-green outline-none"
                    />
                    <input
                        name="img"
                        placeholder="URL Imagen"
                        value={form.img}
                        onChange={handleChange}
                        className="bg-black/50 border border-white/20 p-3 rounded text-white focus:border-neon-green outline-none"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-neon-green py-3 rounded font-bold text-black hover:bg-green-400 col-span-1 md:col-span-2 mt-4 disabled:opacity-50"
                    >
                        {isEditing ? 'ACTUALIZAR PRODUCTO' : 'CREAR PRODUCTO'}
                    </button>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={loading}
                            className="border border-white/20 py-3 rounded font-bold text-white hover:bg-white/10 col-span-1 md:col-span-2 disabled:opacity-50"
                        >
                            CANCELAR EDICIÓN
                        </button>
                    )}
                </form>
            </div>

            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-black/50 text-electric-blue font-orbitron">
                        <tr>
                            <th className="p-4">CÓDIGO</th>
                            <th className="p-4">NOMBRE</th>
                            <th className="p-4">PRECIO</th>
                            <th className="p-4">STOCK</th>
                            <th className="p-4">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {products.map((p) => (
                            <tr key={p.code} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-mono text-sm">{p.code}</td>
                                <td className="p-4">{p.name}</td>
                                <td className="p-4">${p.price}</td>
                                <td className="p-4">{p.stock}</td>
                                <td className="p-4 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="text-electric-blue hover:text-white transition-colors font-bold text-sm"
                                        disabled={loading}
                                    >
                                        EDITAR
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.code)}
                                        className="text-red-500 hover:text-red-400 transition-colors font-bold text-sm"
                                        disabled={loading}
                                    >
                                        ELIMINAR
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td className="p-4 text-gray-400" colSpan="5">
                                    {loading ? 'Cargando...' : 'No hay productos.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
