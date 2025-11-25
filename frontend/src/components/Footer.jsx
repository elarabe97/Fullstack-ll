import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-xl font-orbitron font-bold text-electric-blue mb-4">LEVEL-UP GAMER</h3>
                        <p className="text-gray-400 text-sm">
                            Tu tienda de confianza para equipamiento gamer de alta gama.
                            Envíos a todo Chile.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">ENLACES RÁPIDOS</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/catalogo" className="hover:text-neon-green transition-colors">Catálogo</a></li>
                            <li><a href="/eventos" className="hover:text-neon-green transition-colors">Eventos</a></li>
                            <li><a href="/blog" className="hover:text-neon-green transition-colors">Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">CONTACTO</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>contacto@levelupgamer.cl</li>
                            <li>+56 9 1234 5678</li>
                            <li>Santiago, Chile</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/10 mt-8 pt-8 text-center text-xs text-gray-500">
                    © 2025 Level-Up Gamer. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
