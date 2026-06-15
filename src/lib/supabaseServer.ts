import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';

type AppRole = 'SUPER_ADMIN' | 'BRANCH_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Missing Supabase environment variables.');
}

const checkedSupabaseUrl: string = supabaseUrl;
const checkedSupabasePublishableKey: string = supabasePublishableKey;

export function getBearerToken(request: NextRequest) {
    const authorization = request.headers.get('authorization') || '';
    return authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
}

export function createSupabaseRequestClient(token: string) {
    return createClient(checkedSupabaseUrl, checkedSupabasePublishableKey, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });
}

export async function requireUser(request: NextRequest) {
    const token = getBearerToken(request);

    if (!token) {
        return { error: 'Missing authorization token.', status: 401 as const };
    }

    const supabase = createSupabaseRequestClient(token);
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return { error: 'Invalid or expired session.', status: 401 as const };
    }

    return {
        supabase,
        user: data.user,
        role: data.user.app_metadata?.role as AppRole | undefined,
    };
}
