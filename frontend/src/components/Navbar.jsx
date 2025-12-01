import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import logo from '../assets/img/logo.png';

export default function Navbar() {
    const { user, logout, isLogged } = useUser();
    const { count } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 group">
                    <img src={logo} alt="Level-Up Gamer" className="h-10 w-auto group-hover:drop-shadow-[0_0_10px_rgba(30,144,255,0.7)] transition-all" />
                    <span className="text-xl font-orbitron font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-neon-green group-hover:text-glow transition-all">
                        LEVEL-UP GAMER
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/catalogo" className="hover:text-electric-blue transition-colors text-sm font-bold tracking-wider">CATÁLOGO</Link>
                    <Link to="/comunidad" className="hover:text-electric-blue transition-colors text-sm font-bold tracking-wider">COMUNIDAD</Link>
                    <Link to="/eventos" className="hover:text-electric-blue transition-colors text-sm font-bold tracking-wider">EVENTOS</Link>
                    <Link to="/blog" className="hover:text-electric-blue transition-colors text-sm font-bold tracking-wider">BLOG</Link>

                    {isLogged ? (
                        <div className="flex items-center gap-4">
                            {user.role === 'ADMIN' && (
                                <Link to="/admin" className="text-neon-green hover:text-white transition-colors text-sm font-bold tracking-wider">ADMIN</Link>
                            )}
                            <Link to="/perfil" className="hover:text-electric-blue transition-colors text-sm font-bold tracking-wider">MI PERFIL</Link>

                            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                                <div className="text-right hidden md:block">
                                    <div className="text-sm font-bold text-white">{user.fullName}</div>
                                    <div className="text-xs text-electric-blue">{user.points} pts</div>
                                </div>
                                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors text-sm font-bold tracking-wider">
                                    SALIR
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="hover:text-electric-blue transition-colors text-sm font-bold tracking-wider">INGRESAR</Link>
                            <Link to="/registro" className="bg-electric-blue hover:bg-blue-500 text-black px-4 py-1.5 rounded text-sm font-bold transition-all shadow-electric-blue">
                                REGISTRARSE
                            </Link>
                        </div>
                    )}

                    <Link to="/carrito" className="relative group">
                        <span className="text-2xl group-hover:text-electric-blue transition-colors">🛒</span>
                        {count > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg">
                                {count}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
