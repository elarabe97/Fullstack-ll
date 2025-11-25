import { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('lug_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        // Calculate derived properties
        const isDuoc = userData.email.endsWith('@duoc.cl');
        const discount = isDuoc ? 0.20 : 0;

        const userWithMeta = {
            ...userData,
            duocEmail: isDuoc,
            discount,
            hasDuoc: isDuoc // Alias for convenience
        };

        setUser(userWithMeta);
        localStorage.setItem('lug_user', JSON.stringify(userWithMeta));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('lug_user');
    };

    const value = {
        user,
        setUser, // Exposed if needed for updates (e.g. points)
        login,
        logout,
        isLogged: !!user,
        isAdmin: user?.role === 'ADMIN',
        isClient: user?.role === 'CLIENT'
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
