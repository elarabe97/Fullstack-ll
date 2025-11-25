import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { loginUser } from '../lib/api';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login } = useUser();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await loginUser(formData);
            login({ ...data.user, token: data.token });
            navigate('/catalogo');
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="glass-panel p-8 w-full max-w-md shadow-electric-blue">
                <h2 className="text-3xl font-orbitron font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-green">
                    LOGIN
                </h2>
                {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 border border-red-500/50">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-electric-blue mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-electric-blue/30 rounded p-3 focus:border-neon-green focus:outline-none text-white transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-electric-blue mb-1">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-electric-blue/30 rounded p-3 focus:border-neon-green focus:outline-none text-white transition-colors"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full btn-neon bg-electric-blue text-black hover:bg-blue-500"
                    >
                        INGRESAR
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-400">
                    ¿No tienes cuenta? <Link to="/registro" className="text-neon-green hover:text-electric-blue transition-colors font-bold">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}
