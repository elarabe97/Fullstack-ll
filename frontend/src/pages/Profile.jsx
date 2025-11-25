import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { getMyOrders } from '../lib/api';

export default function Profile() {
    const { user } = useUser();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user?.token) {
            getMyOrders(user.token).then(setOrders).catch(console.error);
        }
    }, [user]);

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-4xl font-orbitron font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-green">
                MI PERFIL
            </h1>

            <div className="glass-panel p-8 mb-8 shadow-electric-blue flex items-center gap-8">
                <div className="bg-gradient-to-br from-electric-blue to-neon-green w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-black shadow-lg">
                    {user?.fullName?.charAt(0)}
                </div>
                <div>
                    <h2 className="text-3xl font-bold font-orbitron mb-2">{user?.fullName}</h2>
                    <p className="text-gray-300 mb-4">{user?.email}</p>
                    <div className="flex gap-4">
                        <span className="bg-black/50 border border-electric-blue/30 px-4 py-1 rounded-full text-sm text-electric-blue font-bold">
                            {user?.role}
                        </span>
                        <span className="bg-black/50 border border-yellow-500/30 px-4 py-1 rounded-full text-sm text-yellow-400 font-bold">
                            {user?.points} Puntos Level-Up
                        </span>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-orbitron font-bold mb-6 text-electric-blue">HISTORIAL DE COMPRAS</h2>
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="glass-panel p-8 text-center text-gray-400">
                        No tienes compras registradas aún.
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="glass-panel p-6 hover:border-neon-green/50 transition-all">
                            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                                <div>
                                    <span className="font-bold text-lg text-neon-green">Orden #{order.id}</span>
                                    <div className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-white">${order.total.toLocaleString()}</div>
                                    <div className="text-xs text-yellow-400">+{order.pointsEarned} pts ganados</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm text-gray-300">
                                        <span>{item.qty}x {item.productName}</span>
                                        <span>${(item.unitPrice * item.qty).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
