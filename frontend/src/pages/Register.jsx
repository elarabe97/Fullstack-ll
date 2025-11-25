import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { registerUser } from '../lib/api';

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        referralCode: ''
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

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (parseInt(formData.age) < 18) {
            setError('Debes ser mayor de 18 años para registrarte');
            return;
        }

        try {
            const { confirmPassword, referralCode, ...dataToSend } = formData;
            // Note: referralCode is not yet handled by backend, but we send it anyway or just ignore it for now
            const data = await registerUser(dataToSend);
            login({ ...data.user, token: data.token });
            navigate('/catalogo');
        } catch (err) {
            setError(err.message || 'Error al registrarse');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="glass-panel p-8 w-full max-w-md shadow-electric-blue">
                <h2 className="text-3xl font-orbitron font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-green">
                    REGISTRO
                </h2>
                {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 border border-red-500/50">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-electric-blue mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-electric-blue/30 rounded p-3 focus:border-neon-green focus:outline-none text-white transition-colors"
                            required
                        />
                    </div>
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
                        <label className="block text-sm font-bold text-electric-blue mb-1">Edad</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
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
                    <div>
                        <label className="block text-sm font-bold text-electric-blue mb-1">Confirmar Contraseña</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-electric-blue/30 rounded p-3 focus:border-neon-green focus:outline-none text-white transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-electric-blue mb-1">Código de Referido (Opcional)</label>
                        <input
                            type="text"
                            name="referralCode"
                            value={formData.referralCode}
                            onChange={handleChange}
                            placeholder="Ej: LEVELUP2025"
                            className="w-full bg-black/50 border border-electric-blue/30 rounded p-3 focus:border-neon-green focus:outline-none text-white transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full btn-neon bg-electric-blue text-black hover:bg-blue-400 mt-4"
                    >
                        REGISTRARSE
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-400">
                    ¿Ya tienes cuenta? <Link to="/login" className="text-neon-green hover:text-electric-blue transition-colors font-bold">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
}
