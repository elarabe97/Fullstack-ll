import React from 'react';

export default function Events() {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-orbitron font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-green">
                MAPA DE EVENTOS
            </h1>
            <div className="glass-panel p-4 shadow-electric-blue">
                <p className="text-center mb-4 text-gray-300">
                    Encuentra los eventos Level-Up más cercanos y gana puntos extra.
                </p>
                <div className="w-full h-[500px] rounded-lg overflow-hidden">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.639768253076!2d-70.6166666848011!3d-33.4322222807786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf756d46358d%3A0x529b996d23233986!2sCostanera%20Center!5e0!3m2!1ses!2scl!4v1646321234567!5m2!1ses!2scl"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
