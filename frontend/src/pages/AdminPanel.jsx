import { useState, useEffect } from 'react';
import { getProducts } from '../lib/api';

export default function AdminPanel() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ code: '', name: '', category: '', price: '', img: '', stock: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        getProducts().then(setProducts).catch(console.error);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit", form);
        alert("Funcionalidad de guardar pendiente de implementación en API");
    };

    const handleEdit = (product) => {
        setForm(product);
        setIsEditing(true);
    };

    const handleDelete = (code) => {
        if (window.confirm('¿Eliminar producto?')) {
            alert("Funcionalidad de eliminar pendiente de implementación en API");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-orbitron font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-electric-blue">
                PANEL DE ADMINISTRACIÓN
            </h1>

            <div className="glass-panel p-8 mb-8 shadow-neon-green">
                <h2 className="text-xl font-bold mb-6 font-orbitron text-neon-green">
                    {isEditing ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="code" placeholder="Código" value={form.code} onChange={handleChange} className="bg-black/50 border border-white/20 p-3 rounded text-white focus:border-neon-green outline-none" disabled={isEditing} />
                    <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="bg-black/50 border border-white/20 p-3 rounded text-white focus:border-neon-green outline-none" />
                    <input name="category" placeholder="Categoría" value={form.category} onChange={handleChange} className="bg-black/50 border border-white/20 p-3 rounded text-white focus:border-neon-green outline-none" />
                    <input name="price" type="number" placeholder="Precio" value={form.price} onChange={handleChange} className="bg-black/50 border border-white/20 p-3 rounded text-white focus:border-neon-green outline-none" />
                    <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} className="bg-black/50 border border-white/20 p-3 rounded text-white focus:border-neon-green outline-none" />
                    <input name="img" placeholder="URL Imagen" value={form.img} onChange={handleChange} className="bg-black/50 border border-white/20 p-3 rounded text-white focus:border-neon-green outline-none" />
                    <button type="submit" className="btn-neon bg-neon-green text-black hover:bg-green-400 col-span-1 md:col-span-2 mt-4">
                        {isEditing ? 'ACTUALIZAR PRODUCTO' : 'CREAR PRODUCTO'}
                    </button>
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
                        {products.map(p => (
                            <tr key={p.code} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-mono text-sm">{p.code}</td>
                                <td className="p-4 font-bold">{p.name}</td>
                                <td className="p-4">${p.price.toLocaleString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {p.stock}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => handleEdit(p)} className="text-electric-blue hover:text-white transition-colors font-bold text-sm">EDITAR</button>
                                    <button onClick={() => handleDelete(p.code)} className="text-red-500 hover:text-red-400 transition-colors font-bold text-sm">ELIMINAR</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
