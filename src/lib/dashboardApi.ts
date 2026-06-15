'use client';

import { supabase } from '@/lib/supabase';

export async function getAccessToken() {
    const { data, error } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (error || !token) {
        throw new Error('Your session expired. Please login again.');
    }

    return token;
}

export async function requestDashboardApi<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await getAccessToken();
    const response = await fetch(path, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(init?.headers || {}),
        },
    });
    const payload = await response.json();

    if (!response.ok) {
        throw new Error(payload.error || 'Request failed.');
    }

    return payload as T;
}
