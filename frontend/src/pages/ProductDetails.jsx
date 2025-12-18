
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductByCode, getReviews, createReview } from '../lib/api';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
    const { code } = useParams();
    const navigate = useNavigate();
    const { user, isAuth } = useUser(); // Tu contexto de usuario
    const { add } = useCart();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newReview, setNewReview] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, [code]);

    const loadData = async () => {
        try {
            setLoading(true);
            // 1. Cargar datos del producto
            const pData = await getProductByCode(code);
            setProduct(pData);

            // 2. Cargar reviews reales desde el backend
            const rData = await getReviews(code);
            setReviews(rData);
        } catch (e) {
            console.error(e);
            setError('No se pudo cargar el producto.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!newReview.trim()) return;

        if (!isAuth) {
            alert("Debes iniciar sesión para comentar.");
            navigate('/login');
            return;
        }

        try {
            // Enviamos el comentario al backend
            await createReview({
                productCode: code,
                comment: newReview,
                token: user.token // Usamos el token del usuario conectado
            });

            setNewReview('');
            // Recargamos las reviews para ver la nueva
            const updatedReviews = await getReviews(code);
            setReviews(updatedReviews);
        } catch (err) {
            alert("Error al enviar comentario. Intenta de nuevo.");
        }
    };

    if (loading) return <div className="text-white text-center mt-10">Cargando...</div>;
    if (error || !product) return <div className="text-red-500 text-center mt-10">Producto no encontrado</div>;

    return (
        <div className="container mx-auto p-4 text-white">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-4">
                &larr; Volver
            </button>

            <div className="grid md:grid-cols-2 gap-8 bg-black/40 p-6 rounded-xl border border-white/10">
                {/* Imagen del Producto */}
                <div className="flex justify-center items-center bg-white/5 rounded-lg p-4">
                    <img
                        src={product.img || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="max-h-96 object-contain rounded"
                    />
                </div>

                {/* Info del Producto */}
                <div>
                    <h1 className="text-4xl font-bold font-orbitron text-neon-green mb-2">{product.name}</h1>
                    <p className="text-gray-400 mb-4">Categoría: {product.category}</p>

                    <div className="text-3xl font-bold mb-6">${product.price}</div>

                    <div className="mb-6">
                        <span className={`px-3 py-1 rounded text-sm ${product.stock > 0 ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                            {product.stock > 0 ? `En Stock (${product.stock})` : 'Agotado'}
                        </span>
                    </div>

                    <button
                        onClick={() => {
                            add(product);
                            alert('¡Producto agregado al carrito!');
                        }}
                        disabled={product.stock <= 0}
                        className="w-full bg-electric-blue hover:bg-blue-600 text-white font-bold py-3 rounded transition mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {product.stock > 0 ? 'AGREGAR AL CARRITO' : 'SIN STOCK'}
                    </button>
                </div>
            </div>

            {/* Sección de Comentarios (Reviews) */}
            <div className="mt-10 max-w-3xl">
                <h2 className="text-2xl font-bold mb-4 border-b border-white/20 pb-2">Opiniones de la Comunidad</h2>

                {/* Formulario para agregar comentario */}
                {isAuth ? (
                    <form onSubmit={handleAddReview} className="mb-8">
                        <textarea
                            className="w-full bg-gray-900 text-white p-3 rounded border border-gray-700 focus:border-neon-green outline-none"
                            rows="3"
                            placeholder="¿Qué te pareció este producto?"
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                        ></textarea>
                        <button type="submit" className="mt-2 px-4 py-2 bg-neon-green text-black font-bold rounded hover:opacity-90">
                            Publicar Opinión
                        </button>
                    </form>
                ) : (
                    <div className="bg-gray-800 p-4 rounded mb-6 text-center">
                        <p>Inicia sesión para dejar tu opinión.</p>
                        <button onClick={() => navigate('/login')} className="text-neon-green hover:underline mt-2">Ir al Login</button>
                    </div>
                )}

                {/* Lista de comentarios */}
                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 italic">No hay comentarios aún. ¡Sé el primero!</p>
                    ) : (
                        reviews.map((r, i) => (
                            <div key={r.id || i} className="bg-white/5 p-4 rounded border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-electric-blue">{r.userName || 'Usuario Anónimo'}</span>
                                    <span className="text-xs text-gray-500">{new Date(r.date || Date.now()).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-300">{r.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
