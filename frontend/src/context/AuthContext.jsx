import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, getUserInfo, logoutUser } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(() => {
        // Загружаем пользователя из localStorage при первой загрузке
        const storedUser = localStorage.getItem('user');
        return storedUser
            ? { isAuthenticated: true, user: JSON.parse(storedUser) }
            : { isAuthenticated: false, user: null };
    });

    // Загружаем пользователя из API `/api/auth/me`
    const loadUserFromDB = async () => {
        try {
            const userData = await getUserInfo();
            setAuthState({
                isAuthenticated: true,
                user: userData
            });
            localStorage.setItem('user', JSON.stringify(userData)); // Сохраняем в localStorage
        } catch (error) {
            console.error('Ошибка при загрузке данных пользователя:', error.message);
            logout();
        }
    };

    // Вход
    const login = async (formData) => {
        try {
            await loginUser(formData);
            await loadUserFromDB();
        } catch (error) {
            console.error('Ошибка при входе:', error.message);
        }
    };

    // Выход
    const logout = async () => {
        try {
            await logoutUser();
            setAuthState({ isAuthenticated: false, user: null });
            localStorage.removeItem('user'); 
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    useEffect(() => {
        loadUserFromDB();
    }, []);

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
