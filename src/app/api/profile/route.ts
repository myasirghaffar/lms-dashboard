import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';
import { getCurrentProfile } from '@/lib/academicApi';

const PROFILE_COLUMNS = 'id, auth_user_id, email, name, role, phone_number, address, profile_image, branch_id, created_at, updated_at';

function cleanProfilePayload(body: Record<string, unknown>) {
    const payload: Record<string, string> = {};
    if (body.name !== undefined) payload.name = String(body.name).trim();
    if (body.phone_number !== undefined) payload.phone_number = String(body.phone_number).trim();
    if (body.address !== undefined) payload.address = String(body.address).trim();
    if (body.profile_image !== undefined) payload.profile_image = String(body.profile_image).trim();
    return payload;
}

function validateProfilePayload(payload: Record<string, string>) {
    if (payload.name !== undefined && !payload.name) return 'Name is required.';
    return null;
}

async function decorateProfile(auth: Exclude<Awaited<ReturnType<typeof requireUser>>, { error: string; status: 401 }>, profile: any) {
    let branchName: string | null = null;
    if (profile?.branch_id) {
        const { data, error } = await auth.supabase.from('branches').select('name').eq('id', profile.branch_id).maybeSingle();
        if (error) throw new Error(error.message);
        branchName = data?.name || null;
    }

    return {
        ...profile,
        branch_name: branchName,
    };
}

export async function GET(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const profileRef = await getCurrentProfile(auth);
        if (!profileRef?.id) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

        const { data, error } = await auth.supabase.from('user_profiles').select(PROFILE_COLUMNS).eq('id', profileRef.id).single();
        if (error) throw new Error(error.message);
        return NextResponse.json({ profile: await decorateProfile(auth, data) });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load profile.' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const payload = cleanProfilePayload(await request.json());
    const validationError = validateProfilePayload(payload);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    try {
        const profileRef = await getCurrentProfile(auth);
        if (!profileRef?.id) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

        const { data, error } = await auth.supabase
            .from('user_profiles')
            .update(payload)
            .eq('id', profileRef.id)
            .select(PROFILE_COLUMNS)
            .single();
        if (error) throw new Error(error.message);
        return NextResponse.json({ profile: await decorateProfile(auth, data) });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to update profile.' }, { status: 500 });
    }
}
