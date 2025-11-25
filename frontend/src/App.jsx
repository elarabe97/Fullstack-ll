import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Events from './pages/Events';
import Blog from './pages/Blog';
import { useUser } from './context/UserContext';

import Footer from './components/Footer';

function App() {
    const { isLogged, isAdmin } = useUser();

    return (
        <div className="min-h-screen flex flex-col bg-black text-white font-roboto">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/" element={<Catalog />} />
                    <Route path="/catalogo" element={<Catalog />} />
                    <Route path="/eventos" element={<Events />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Register />} />
                    {isLogged && <Route path="/carrito" element={<Cart />} />}
                    {isLogged && <Route path="/perfil" element={<Profile />} />}
                    {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
                </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
}

export default App;
