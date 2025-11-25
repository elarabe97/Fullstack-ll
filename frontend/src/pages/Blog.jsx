import React from 'react';

export default function Blog() {
    const posts = [
        {
            id: 1,
            title: "El Futuro del Gaming en 2025",
            excerpt: "Descubre las nuevas tecnologías que revolucionarán la industria este año.",
            date: "22 Nov 2025",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "Guía para armar tu primer PC Gamer",
            excerpt: "Todo lo que necesitas saber para elegir los mejores componentes.",
            date: "20 Nov 2025",
            image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: "Los mejores juegos indie del mes",
            excerpt: "Pequeñas joyas que no te puedes perder.",
            date: "18 Nov 2025",
            image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-orbitron font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-electric-blue">
                BLOG LEVEL-UP
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map(post => (
                    <div key={post.id} className="glass-panel overflow-hidden hover:shadow-electric-blue transition-all duration-300 group">
                        <div className="h-48 overflow-hidden">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-6">
                            <span className="text-neon-green text-sm font-bold">{post.date}</span>
                            <h3 className="text-xl font-bold mt-2 mb-3 group-hover:text-electric-blue transition-colors">{post.title}</h3>
                            <p className="text-gray-400 text-sm">{post.excerpt}</p>
                            <button className="mt-4 text-electric-blue hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
                                Leer más &rarr;
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
