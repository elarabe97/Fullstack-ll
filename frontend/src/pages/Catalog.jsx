import { useState, useEffect } from 'react';
import { getProducts } from '../lib/api';
import { useCart } from '../context/CartContext';

export default function Catalog() {
    const [products, setProducts] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const { add } = useCart();

    useEffect(() => {
        getProducts().then(setProducts).catch(console.error);
    }, []);

    const handleAddToCart = (product) => {
        add(product);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
    };

    return (
        <div>
            {showPopup && (
                <div className="fixed top-24 right-4 bg-neon-green text-black px-6 py-3 rounded shadow-neon-green z-50 font-bold animate-bounce">
                    ¡Producto agregado al carrito!
                </div>
            )}
            {/* Hero Section */}
            <div className="relative h-[400px] flex items-center justify-center overflow-hidden mb-12">
                <div className="absolute inset-0 bg-gradient-to-b from-electric-blue/20 to-black z-0"></div>
                <div className="relative z-10 text-center">
                    <h1 className="text-6xl font-orbitron font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-green text-glow">
                        LEVEL-UP YOUR GAME
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        El mejor equipamiento para gamers de verdad. Consolas, accesorios y más.
                    </p>
                </div>
            </div>

            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <div key={product.code} className="glass-panel p-4 flex flex-col group hover:border-electric-blue/50 transition-all duration-300">
                            <div className="relative overflow-hidden rounded-lg mb-4 h-48">
                                <img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                {product.stock <= 0 && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                        <span className="text-red-500 font-bold border-2 border-red-500 px-4 py-1 rounded rotate-12">AGOTADO</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="text-xs text-electric-blue mb-1 font-bold uppercase tracking-wider">{product.category}</div>
                                <h3 className="text-lg font-bold mb-2 group-hover:text-neon-green transition-colors">{product.name}</h3>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between items-end mb-3">
                                    <div className="text-2xl font-bold text-white">${product.price.toLocaleString()}</div>
                                    <div className="text-xs text-gray-400">
                                        Stock: <span className={product.stock > 0 ? "text-green-400" : "text-red-500"}>{product.stock}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock <= 0}
                                        className={`flex-1 py-2 rounded font-bold transition-all duration-300 ${product.stock > 0
                                            ? 'bg-electric-blue hover:bg-blue-500 shadow-electric-blue hover:scale-105 text-black'
                                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {product.stock > 0 ? 'AGREGAR' : 'SIN STOCK'}
                                    </button>
                                    <button
                                        className="px-3 py-2 rounded border border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-black transition-colors"
                                        title="Compartir"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-share-fill" viewBox="0 0 16 16">
                                            <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
