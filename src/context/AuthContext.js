import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            setLoading(true);
            const response = await api.post('/auth/login', { username, password });

            if (response.data.success) {
                // The backend returns AuthResponse containing token, username, email, and role
                // We extract token separately and keep the rest as userData
                const { token, ...userData } = response.data.data;

                // Capturing all fields returned by backend (e.g., fullName if added)
                // and normalizing role for backward compatibility
                if (userData.role === 'PATIENT') {
                    userData.role = 'CUSTOMER';
                }

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setError(null);
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await api.post('/auth/register', userData);

            if (response.data.success) {
                // Similarly capture all user data from registration response
                const { token, ...userInfo } = response.data.data;

                // Normalize role just in case
                if (userInfo.role === 'PATIENT') {
                    userInfo.role = 'CUSTOMER';
                }

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userInfo));
                setUser(userInfo);
                setError(null);
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (err) {
            console.error('Registration error:', err);
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};