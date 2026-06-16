import { NextResponse } from 'next/server';
import type { requireUser } from '@/lib/supabaseServer';

type AuthResult = Exclude<Awaited<ReturnType<typeof requireUser>>, { error: string; status: 401 }>;

export async function getCurrentProfile(auth: AuthResult) {
    const { data, error } = await auth.supabase
        .from('user_profiles')
        .select('id, auth_user_id, email, name, role, branch_id')
        .or(`auth_user_id.eq.${auth.user.id},email.eq.${auth.user.email || ''}`)
        .limit(1)
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export function canManageAcademics(role?: string) {
    return role === 'SUPER_ADMIN' || role === 'BRANCH_ADMIN';
}

export function jsonError(error: unknown, fallback: string, status = 500) {
    return NextResponse.json({ error: error instanceof Error ? error.message : fallback }, { status });
}
