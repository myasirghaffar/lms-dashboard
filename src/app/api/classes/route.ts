import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';

export async function GET(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data, error } = await auth.supabase
        .from('classes')
        .select('id, legacy_id, name, branch_id')
        .order('name', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ classes: data || [] });
}
