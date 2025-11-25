import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { createOrder } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const { items, remove, update, clear, subtotal, discountAmount, total, points } = useCart();
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const orderItems = items.map(item => ({ code: item.code, qty: item.qty }));
            await createOrder({ token: user.token, items: orderItems });

            // Update user points locally
            const updatedUser = { ...user, points: user.points + points };
            setUser(updatedUser);
            localStorage.setItem('lug_user', JSON.stringify(updatedUser));

            clear();
            setSuccess(true);
        } catch (error) {
            alert('Error al procesar la compra: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex justify-center mt-20">
                <div className="glass-panel p-10 text-center border-neon-green/50 shadow-neon-green">
                    <h2 className="text-4xl font-orbitron font-bold text-neon-green mb-4">¡COMPRA EXITOSA!</h2>
                    <p className="text-xl mb-6">Has ganado <span className="text-yellow-400 font-bold text-2xl">{points}</span> puntos.</p>
                    <button
                        onClick={() => navigate('/catalogo')}
                        className="btn-neon bg-neon-green text-black shadow-none hover:bg-green-400"
                    >
                        VOLVER AL CATÁLOGO
                    </button>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center mt-20">
                <h2 className="text-3xl font-orbitron mb-6 text-gray-400">TU CARRITO ESTÁ VACÍO</h2>
                <button
                    onClick={() => navigate('/catalogo')}
                    className="text-electric-blue hover:text-neon-green text-xl underline transition-colors"
                >
                    Ir a comprar equipamiento
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-4xl font-orbitron font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-green">
                TU EQUIPAMIENTO
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map(item => (
                        <div key={item.code} className="glass-panel p-4 flex justify-between items-center hover:border-electric-blue/50 transition-colors">
                            <div className="flex items-center gap-6">
                                <img src={item.img} alt={item.name} className="w-24 h-24 object-cover rounded-lg border border-white/10" />
                                <div>
                                    <h3 className="font-bold text-xl font-orbitron">{item.name}</h3>
                                    <p className="text-electric-blue font-bold">${item.price.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3 bg-black/50 rounded-lg p-1 border border-white/10">
                                    <button onClick={() => update(item.code, item.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition">-</button>
                                    <span className="font-bold w-4 text-center">{item.qty}</span>
                                    <button onClick={() => update(item.code, item.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition">+</button>
                                </div>
                                <button onClick={() => remove(item.code)} className="text-red-500 hover:text-red-400 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="glass-panel p-8 h-fit sticky top-24">
                    <h3 className="text-2xl font-orbitron font-bold mb-6 border-b border-white/10 pb-4">RESUMEN</h3>
                    <div className="space-y-3 mb-6 text-gray-300">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>
                        {discountAmount > 0 && (
                            <div className="flex justify-between text-neon-green">
                                <span>Descuento Duoc (20%)</span>
                                <span>-${discountAmount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-white text-xl">
                            <span>Total</span>
                            <span className="text-electric-blue text-glow">${total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-yellow-400 text-sm pt-2">
                            <span>Puntos a ganar</span>
                            <span>+{points}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full btn-neon bg-electric-blue text-black hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'PROCESANDO...' : 'FINALIZAR COMPRA'}
                    </button>
                </div>
            </div>
        </div>
    );
}
