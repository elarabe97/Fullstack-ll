import { useState, useEffect } from 'react';
import { getReviews, createReview } from '../lib/api';
import { useUser } from '../context/UserContext';

export default function Community() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    // Form state
    const [productCode, setProductCode] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchReviews = () => {
        getReviews()
            .then(setReviews)
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productCode) return alert('Debes ingresar un código de producto (ej: P001)');

        setSubmitting(true);
        try {
            await createReview({
                token: user.token,
                productCode,
                rating: parseInt(rating),
                comment
            });
            setComment('');
            setProductCode('');
            fetchReviews(); // Refresh list
        } catch (error) {
            alert('Error al publicar reseña');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-purple-500">Comunidad Gamer</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Review Form */}
                <div className="md:col-span-1">
                    <div className="bg-gray-800 p-6 rounded border border-gray-700 sticky top-4">
                        <h3 className="text-xl font-bold mb-4">Escribe una reseña</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Código Producto</label>
                                <input
                                    type="text"
                                    value={productCode}
                                    onChange={(e) => setProductCode(e.target.value)}
                                    placeholder="Ej: P001"
                                    className="w-full bg-gray-700 rounded p-2 border border-gray-600"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Calificación</label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    className="w-full bg-gray-700 rounded p-2 border border-gray-600"
                                >
                                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Estrellas</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Comentario</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows="4"
                                    className="w-full bg-gray-700 rounded p-2 border border-gray-600"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded font-bold transition disabled:opacity-50"
                            >
                                {submitting ? 'Publicando...' : 'Publicar Reseña'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="md:col-span-2 space-y-4">
                    {loading ? (
                        <div>Cargando reseñas...</div>
                    ) : reviews.length === 0 ? (
                        <div>No hay reseñas aún. ¡Sé el primero!</div>
                    ) : (
                        reviews.map(review => (
                            <div key={review.id} className="bg-gray-800 p-4 rounded border border-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-lg">{review.userName}</h4>
                                        <span className="text-sm text-gray-400">Sobre: {review.productCode}</span>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                </div>
                                <p className="text-gray-300">{review.comment}</p>
                                <div className="text-xs text-gray-500 mt-2">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
