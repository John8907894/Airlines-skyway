import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('skyway_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('skyway_user');
        if (savedUser && token) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
                localStorage.removeItem('skyway_user');
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.login(email, password);
            if (response.token) {
                setToken(response.token);
                setUser(response.user);
                localStorage.setItem('skyway_token', response.token);
                localStorage.setItem('skyway_user', JSON.stringify(response.user));
                return { success: true };
            }
            return { success: false, message: response.message || 'Login failed' };
        } catch (error) {
            return { success: false, message: 'Network error or server unavailable' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await api.register({ name, email, password });
            if (response.token) {
                setToken(response.token);
                setUser(response.user);
                localStorage.setItem('skyway_token', response.token);
                localStorage.setItem('skyway_user', JSON.stringify(response.user));
                return { success: true };
            }
            return { success: false, message: response.message || 'Registration failed' };
        } catch (error) {
            return { success: false, message: 'Network error or server unavailable' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('skyway_user');
        localStorage.removeItem('skyway_token');
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            login, 
            logout, 
            register, 
            isAuthenticated: !!user, 
            isAdmin: user?.role === 'admin',
            loading 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
