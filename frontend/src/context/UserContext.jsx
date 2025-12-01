import { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('lug_user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            // Use duocEmail from backend, but fallback to email check for backwards compatibility
            // Force check on email domains to support @duocuc.cl even if cloud backend returns false
            const isDuoc = userData.duocEmail === true ||
                userData.email?.endsWith('@duoc.cl') ||
                userData.email?.endsWith('@duocuc.cl');
            const discount = isDuoc ? 0.20 : 0;
            setUser({
                ...userData,
                duocEmail: isDuoc,
                discount,
                hasDuoc: isDuoc
            });
        }
    }, []);

    const login = (userData) => {
        // Use duocEmail from backend response
        // Force check on email domains
        const isDuoc = userData.duocEmail === true ||
            userData.email.endsWith('@duoc.cl') ||
            userData.email.endsWith('@duocuc.cl');
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
