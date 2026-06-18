import { NextRequest, NextResponse } from 'next/server';
import { getCurrentProfile } from '@/lib/academicApi';
import { requireUser } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const profile = await getCurrentProfile(auth);
    if (!profile?.id) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const { error } = await auth.supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('target_profile_id', profile.id)
      .is('read_at', null);

    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to mark notifications read.' }, { status: 500 });
  }
}
