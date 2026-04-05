import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// No live backend needed: Mocking API with localStorage
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initial load: check for user and initialize mock "database"
    useEffect(() => {
        const storedUser = localStorage.getItem('margmitra_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const mockUsers = localStorage.getItem('margmitra_mock_users');
        if (!mockUsers || JSON.parse(mockUsers).length === 0) {
            // Pre-seed a test user for convenience
            const testUser = { 
                email: 'test@test.com', 
                password: 'password', 
                name: 'Test User', 
                id: 'test-123',
                createdAt: new Date().toISOString()
            };
            localStorage.setItem('margmitra_mock_users', JSON.stringify([testUser]));
        }

        setLoading(false);
    }, []);

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mockUsers = JSON.parse(localStorage.getItem('margmitra_mock_users') || '[]');
                if (mockUsers.find(u => u.email === userData.email)) {
                    setError('User already exists');
                    setLoading(false);
                    return reject(new Error('User already exists'));
                }

                // Append new user to mock db
                const newUser = { ...userData, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
                mockUsers.push(newUser);
                localStorage.setItem('margmitra_mock_users', JSON.stringify(mockUsers));

                // Log in automatically
                setUser(newUser);
                localStorage.setItem('margmitra_user', JSON.stringify(newUser));
                setLoading(false);
                resolve(newUser);
            }, 800);
        });
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mockUsers = JSON.parse(localStorage.getItem('margmitra_mock_users') || '[]');
                const foundUser = mockUsers.find(u => u.email === email && u.password === password);
                
                if (!foundUser) {
                    setError('Invalid credentials');
                    setLoading(false);
                    return reject(new Error('Invalid credentials'));
                }

                setUser(foundUser);
                localStorage.setItem('margmitra_user', JSON.stringify(foundUser));
                setLoading(false);
                resolve(foundUser);
            }, 800);
        });
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('margmitra_user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
