import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Persist login state
    useEffect(() => {
        const storedUser = localStorage.getItem('margmitra_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const register = async (userData) => {
        try {
            setError(null);
            const response = await axios.post(`${API_URL}/register`, userData);
            setUser(response.data);
            localStorage.setItem('margmitra_user', JSON.stringify(response.data));
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await axios.post(`${API_URL}/login`, { email, password });
            setUser(response.data);
            localStorage.setItem('margmitra_user', JSON.stringify(response.data));
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/logout`);
            setUser(null);
            localStorage.removeItem('margmitra_user');
        } catch (err) {
            console.error('Logout error', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
