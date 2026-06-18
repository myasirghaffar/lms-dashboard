'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
    updateUser: (updates: Partial<Pick<User, 'email' | 'name'>>) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored user session on mount
        const initAuth = async () => {
            const { data } = await supabase.auth.getSession();
            const sessionUser = data.session?.user;

            if (sessionUser) {
                const role = sessionUser.app_metadata?.role as UserRole | undefined;

                if (role) {
                    const currentUser: User = {
                        id: sessionUser.id,
                        email: sessionUser.email || '',
                        name: sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || 'User',
                        role,
                    };
                    setUser(currentUser);
                    localStorage.setItem('user', JSON.stringify(currentUser));
                }
            } else {
                localStorage.removeItem('user');
            }

            setIsLoading(false);
        };

        void initAuth();
    }, []);

    const login = async (email: string, password: string, role: UserRole) => {
        setIsLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            setIsLoading(false);
            throw new Error(error?.message || 'Invalid login credentials.');
        }

        const appRole = data.user.app_metadata?.role as UserRole | undefined;

        if (!appRole || appRole !== role) {
            await supabase.auth.signOut();
            setIsLoading(false);
            throw new Error('Selected role does not match this account.');
        }

        const currentUser: User = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || email.split('@')[0],
            role: appRole,
        };

        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));
        setIsLoading(false);
    };

    const logout = () => {
        void supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem('user');
    };

    const updateUser = React.useCallback((updates: Partial<Pick<User, 'email' | 'name'>>) => {
        setUser((current) => {
            if (!current) return current;
            const updatedUser = { ...current, ...updates };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
                updateUser,
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
