import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';
import { getCurrentProfile } from '@/lib/academicApi';
import { calculateFeeTotals } from '@/lib/fees';
import type { FeeChallanPayload, FeeLineItem } from '@/types/fees';

const CHALLAN_COLUMNS = 'id, challan_number, student_id, parent_profile_id, branch_id, class_id, fee_month, issue_date, due_date, validity_date, subtotal, discount_amount, deposit_amount, total_amount, due_amount, late_fee_amount, payable_after_due_date, status, notes, created_by_profile_id, created_at, updated_at';
const ITEM_COLUMNS = 'id, challan_id, particular_id, label, amount, sort_order';
const STUDENT_COLUMNS = 'id, legacy_id, user_profile_id, parent_profile_id, branch_id, class_id, roll_number, father_name, previous_balance, monthly_fee';
const PROFILE_COLUMNS = 'id, auth_user_id, email, name, phone_number, address, profile_image, role';

const canManageFees = (role?: string) => role === 'SUPER_ADMIN' || role === 'BRANCH_ADMIN';

function cleanLineItems(items: FeeLineItem[]) {
  return items
    .map((item, index) => ({
      particular_id: String(item.id || '').trim(),
      label: String(item.label || '').trim(),
      amount: Math.max(0, Number(item.amount || 0)),
      sort_order: index + 1,
    }))
    .filter((item) => item.particular_id && item.label);
}

function cleanPayload(body: Partial<FeeChallanPayload>): FeeChallanPayload {
  return {
    student_ids: Array.isArray(body.student_ids) ? body.student_ids.map(String).filter(Boolean) : [],
    fee_month: String(body.fee_month || '').trim(),
    issue_date: String(body.issue_date || '').trim(),
    due_date: String(body.due_date || '').trim(),
    validity_date: String(body.validity_date || '').trim(),
    items: Array.isArray(body.items) ? body.items : [],
    deposit_amount: Math.max(0, Number(body.deposit_amount || 0)),
    notes: String(body.notes || '').trim(),
  };
}

function validatePayload(payload: FeeChallanPayload) {
  if (!payload.student_ids.length) return 'Select at least one student.';
  if (!payload.fee_month) return 'Fee month is required.';
  if (!payload.issue_date || !payload.due_date || !payload.validity_date) return 'Issue, due, and validity dates are required.';
  if (!cleanLineItems(payload.items).length) return 'At least one fee line item is required.';
  return null;
}

function generateChallanNumber(studentId: string) {
  const compactDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = studentId.replace(/-/g, '').slice(0, 8).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CH-${compactDate}-${suffix}-${random}`;
}

function buildStudentLineItems(baseItems: ReturnType<typeof cleanLineItems>, student: any) {
  return baseItems.map((item) => {
    if (item.particular_id === 'MONTHLY_FEE') {
      return { ...item, amount: Math.max(0, Number(student.monthly_fee || 0)) };
    }
    if (item.particular_id === 'PREVIOUS_BALANCE') {
      return { ...item, amount: Math.max(0, Number(student.previous_balance || 0)) };
    }
    return item;
  });
}

async function decorateChallans(auth: Exclude<Awaited<ReturnType<typeof requireUser>>, { error: string; status: 401 }>, challans: any[]) {
  if (!challans.length) return [];

  const challanIds = challans.map((challan) => challan.id);
  const studentIds = [...new Set(challans.map((challan) => challan.student_id).filter(Boolean))];

  const [{ data: items, error: itemsError }, { data: students, error: studentsError }] = await Promise.all([
    auth.supabase.from('fee_challan_items').select(ITEM_COLUMNS).in('challan_id', challanIds).order('sort_order', { ascending: true }),
    auth.supabase.from('students').select(STUDENT_COLUMNS).in('id', studentIds),
  ]);

  if (itemsError) throw new Error(itemsError.message);
  if (studentsError) throw new Error(studentsError.message);

  const profileIds = [...new Set((students || []).flatMap((student) => [student.user_profile_id, student.parent_profile_id]).filter(Boolean))];
  const branchIds = [...new Set((students || []).map((student) => student.branch_id).filter(Boolean))];
  const classIds = [...new Set((students || []).map((student) => student.class_id).filter(Boolean))];

  const [
    { data: profiles, error: profileError },
    { data: branches, error: branchError },
    { data: classes, error: classError },
  ] = await Promise.all([
    profileIds.length ? auth.supabase.from('user_profiles').select(PROFILE_COLUMNS).in('id', profileIds) : Promise.resolve({ data: [], error: null }),
    branchIds.length ? auth.supabase.from('branches').select('id, name, address, phone_number, email').in('id', branchIds) : Promise.resolve({ data: [], error: null }),
    classIds.length ? auth.supabase.from('classes').select('id, name').in('id', classIds) : Promise.resolve({ data: [], error: null }),
  ]);

  if (profileError) throw new Error(profileError.message);
  if (branchError) throw new Error(branchError.message);
  if (classError) throw new Error(classError.message);

  const itemsByChallan = new Map<string, FeeLineItem[]>();
  (items || []).forEach((item) => {
    const rows = itemsByChallan.get(item.challan_id) || [];
    rows.push({
      id: item.particular_id,
      label: item.label,
      amount: Number(item.amount || 0),
    } as FeeLineItem);
    itemsByChallan.set(item.challan_id, rows);
  });

  const studentsById = new Map((students || []).map((student) => [student.id, student]));
  const profilesById = new Map((profiles || []).map((profile) => [profile.id, profile]));
  const branchesById = new Map((branches || []).map((branch) => [branch.id, branch]));
  const classesById = new Map((classes || []).map((schoolClass) => [schoolClass.id, schoolClass]));

  return challans.map((challan) => {
    const studentRow = studentsById.get(challan.student_id);
    const studentProfile = studentRow ? profilesById.get(studentRow.user_profile_id) : null;
    const parentProfile = studentRow?.parent_profile_id ? profilesById.get(studentRow.parent_profile_id) : null;
    const branch = studentRow?.branch_id ? branchesById.get(studentRow.branch_id) : null;
    const schoolClass = studentRow?.class_id ? classesById.get(studentRow.class_id) : null;

    return {
      ...challan,
      subtotal: Number(challan.subtotal || 0),
      discount_amount: Number(challan.discount_amount || 0),
      deposit_amount: Number(challan.deposit_amount || 0),
      total_amount: Number(challan.total_amount || 0),
      due_amount: Number(challan.due_amount || 0),
      late_fee_amount: Number(challan.late_fee_amount || 0),
      payable_after_due_date: Number(challan.payable_after_due_date || 0),
      items: itemsByChallan.get(challan.id) || [],
      student: {
        id: studentRow?.id || challan.student_id,
        userId: studentRow?.user_profile_id,
        parentId: studentRow?.parent_profile_id || undefined,
        name: studentProfile?.name || 'Unknown Student',
        fatherName: studentRow?.father_name || parentProfile?.name || 'N/A',
        class: schoolClass?.name || 'N/A',
        rollNumber: studentRow?.roll_number || '',
        branchId: studentRow?.branch_id || null,
        branchName: branch?.name || null,
        branchAddress: branch?.address || null,
        branchPhone: branch?.phone_number || null,
        branchEmail: branch?.email || null,
        parentName: parentProfile?.name || null,
        previousBalance: Number(studentRow?.previous_balance || 0),
        monthlyFee: Number(studentRow?.monthly_fee || 0),
      },
    };
  });
}

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const profile = await getCurrentProfile(auth);
    if (!profile?.id) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    let query = auth.supabase.from('fee_challans').select(CHALLAN_COLUMNS).order('created_at', { ascending: false });

    const studentId = request.nextUrl.searchParams.get('student_id');
    if (studentId) query = query.eq('student_id', studentId);

    if (auth.role === 'PARENT') {
      const { data: children, error } = await auth.supabase.from('students').select('id').eq('parent_profile_id', profile.id);
      if (error) throw new Error(error.message);
      const childIds = (children || []).map((child) => child.id);
      if (!childIds.length) return NextResponse.json({ challans: [] });
      query = query.in('student_id', childIds);
    } else if (auth.role === 'STUDENT') {
      const { data: student, error } = await auth.supabase.from('students').select('id').eq('user_profile_id', profile.id).maybeSingle();
      if (error) throw new Error(error.message);
      if (!student?.id) return NextResponse.json({ challans: [] });
      query = query.eq('student_id', student.id);
    } else if (!canManageFees(auth.role)) {
      return NextResponse.json({ error: 'Only linked students, parents, and school admins can view fee challans.' }, { status: 403 });
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return NextResponse.json({ challans: await decorateChallans(auth, data || []) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load fee challans.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!canManageFees(auth.role)) {
    return NextResponse.json({ error: 'Only school admins can create fee challans.' }, { status: 403 });
  }

  const payload = cleanPayload(await request.json());
  const validationError = validatePayload(payload);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  try {
    const profile = await getCurrentProfile(auth);
    if (!profile?.id) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const { data: students, error: studentError } = await auth.supabase
      .from('students')
      .select(STUDENT_COLUMNS)
      .in('id', payload.student_ids);

    if (studentError) throw new Error(studentError.message);
    if (!students?.length) return NextResponse.json({ error: 'No matching students found.' }, { status: 404 });

    const baseLineItems = cleanLineItems(payload.items);

    const challanRows = students.map((student) => ({
      challan_number: generateChallanNumber(student.id),
      student_id: student.id,
      parent_profile_id: student.parent_profile_id,
      branch_id: student.branch_id,
      class_id: student.class_id,
      fee_month: payload.fee_month,
      issue_date: payload.issue_date,
      due_date: payload.due_date,
      validity_date: payload.validity_date,
      ...(() => {
        const lineItems = buildStudentLineItems(baseLineItems, student);
        const totals = calculateFeeTotals(
          lineItems.map((item) => ({ id: item.particular_id, label: item.label, amount: item.amount } as FeeLineItem)),
          payload.deposit_amount,
        );
        return {
          subtotal: totals.subtotal,
          discount_amount: totals.discount,
          deposit_amount: totals.deposit,
          total_amount: totals.total,
          due_amount: totals.due,
          late_fee_amount: totals.lateFee,
          payable_after_due_date: totals.payableAfterDueDate,
          status: totals.due === 0 && totals.total > 0 ? 'paid' : 'issued',
        };
      })(),
      notes: payload.notes || '',
      created_by_profile_id: profile.id,
    }));

    const { data: created, error: challanError } = await auth.supabase
      .from('fee_challans')
      .insert(challanRows)
      .select(CHALLAN_COLUMNS);

    if (challanError) throw new Error(challanError.message);

    const studentsById = new Map(students.map((student) => [student.id, student]));
    const itemRows = (created || []).flatMap((challan) => {
      const student = studentsById.get(challan.student_id);
      const lineItems = buildStudentLineItems(baseLineItems, student);
      return lineItems.map((item) => ({
          challan_id: challan.id,
          particular_id: item.particular_id,
          label: item.label,
          amount: item.amount,
          sort_order: item.sort_order,
        }));
    });

    if (itemRows.length) {
      const { error: itemError } = await auth.supabase.from('fee_challan_items').insert(itemRows);
      if (itemError) throw new Error(itemError.message);
    }

    return NextResponse.json({ challans: await decorateChallans(auth, created || []) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create fee challans.' }, { status: 500 });
  }
}
