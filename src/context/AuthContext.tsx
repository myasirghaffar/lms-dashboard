'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'SUPER_ADMIN' | 'BRANCH_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string, role: UserRole) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored user session on mount
        const initAuth = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string, role: UserRole) => {
        setIsLoading(true);

        const { getUsers } = await import('@/lib/api');
        const users = getUsers();
        const foundUser = users.find(u => u.email === email && u.role === role);

        await new Promise(resolve => setTimeout(resolve, 500));

        if (foundUser) {
            const user: User = {
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name || email.split('@')[0],
                role: foundUser.role as UserRole, // explicit cast to match generic UserRole
            };
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            // Fallback for testing if user not in json
            const mockUser: User = {
                id: '1',
                email,
                name: email.split('@')[0],
                role,
            };
            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
        }
        setIsLoading(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
