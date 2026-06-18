import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';
import { getCurrentProfile } from '@/lib/academicApi';
import type { FeePaymentMethod, FeePaymentPayload } from '@/types/fees';

const PAYMENT_COLUMNS = 'id, receipt_number, challan_id, student_id, parent_profile_id, branch_id, class_id, amount, payment_method, payment_date, received_from, reference_number, notes, received_by_profile_id, created_at, updated_at';
const CHALLAN_COLUMNS = 'id, challan_number, student_id, parent_profile_id, branch_id, class_id, fee_month, issue_date, due_date, validity_date, subtotal, discount_amount, deposit_amount, total_amount, due_amount, late_fee_amount, payable_after_due_date, status, notes, created_by_profile_id, created_at, updated_at';
const STUDENT_COLUMNS = 'id, user_profile_id, parent_profile_id, branch_id, class_id, roll_number, father_name, previous_balance, monthly_fee';
const PROFILE_COLUMNS = 'id, auth_user_id, email, name, phone_number, address, profile_image, role';

const canManageFees = (role?: string) => role === 'SUPER_ADMIN' || role === 'BRANCH_ADMIN';
const PAYMENT_METHODS: FeePaymentMethod[] = ['cash', 'bank_transfer', 'card', 'cheque', 'online', 'other'];

function cleanPaymentPayload(body: Partial<FeePaymentPayload>): FeePaymentPayload {
  const method = String(body.payment_method || 'cash') as FeePaymentMethod;
  return {
    challan_id: String(body.challan_id || '').trim(),
    amount: Math.max(0, Number(body.amount || 0)),
    payment_method: PAYMENT_METHODS.includes(method) ? method : 'cash',
    payment_date: String(body.payment_date || new Date().toISOString().slice(0, 10)).trim(),
    received_from: String(body.received_from || '').trim(),
    reference_number: String(body.reference_number || '').trim(),
    notes: String(body.notes || '').trim(),
  };
}

function validatePaymentPayload(payload: FeePaymentPayload) {
  if (!payload.challan_id) return 'Select a challan.';
  if (!payload.amount || payload.amount <= 0) return 'Payment amount must be greater than zero.';
  if (!payload.payment_date) return 'Payment date is required.';
  return null;
}

function generateReceiptNumber(challanNumber: string) {
  const compactDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = challanNumber.replace(/[^0-9A-Za-z]/g, '').slice(-8).toUpperCase() || 'FEE';
  const random = Math.floor(1000 + Math.random() * 9000);
  return `RC-${compactDate}-${suffix}-${random}`;
}

async function decoratePayments(auth: Exclude<Awaited<ReturnType<typeof requireUser>>, { error: string; status: 401 }>, payments: any[]) {
  if (!payments.length) return [];

  const challanIds = [...new Set(payments.map((payment) => payment.challan_id).filter(Boolean))];
  const receiverIds = [...new Set(payments.map((payment) => payment.received_by_profile_id).filter(Boolean))];

  const [
    { data: challans, error: challanError },
    { data: receivers, error: receiverError },
  ] = await Promise.all([
    challanIds.length ? auth.supabase.from('fee_challans').select(CHALLAN_COLUMNS).in('id', challanIds) : Promise.resolve({ data: [], error: null }),
    receiverIds.length ? auth.supabase.from('user_profiles').select('id, name').in('id', receiverIds) : Promise.resolve({ data: [], error: null }),
  ]);

  if (challanError) throw new Error(challanError.message);
  if (receiverError) throw new Error(receiverError.message);

  const studentIds = [...new Set((challans || []).map((challan) => challan.student_id).filter(Boolean))];
  const { data: students, error: studentError } = studentIds.length
    ? await auth.supabase.from('students').select(STUDENT_COLUMNS).in('id', studentIds)
    : { data: [], error: null };
  if (studentError) throw new Error(studentError.message);

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

  const challansById = new Map((challans || []).map((challan) => [challan.id, challan]));
  const receiversById = new Map((receivers || []).map((receiver) => [receiver.id, receiver.name]));
  const studentsById = new Map((students || []).map((student) => [student.id, student]));
  const profilesById = new Map((profiles || []).map((profile) => [profile.id, profile]));
  const branchesById = new Map((branches || []).map((branch) => [branch.id, branch]));
  const classesById = new Map((classes || []).map((schoolClass) => [schoolClass.id, schoolClass]));

  return payments.map((payment) => {
    const challan = challansById.get(payment.challan_id);
    const studentRow = challan ? studentsById.get(challan.student_id) : null;
    const studentProfile = studentRow ? profilesById.get(studentRow.user_profile_id) : null;
    const parentProfile = studentRow?.parent_profile_id ? profilesById.get(studentRow.parent_profile_id) : null;
    const branch = studentRow?.branch_id ? branchesById.get(studentRow.branch_id) : null;
    const schoolClass = studentRow?.class_id ? classesById.get(studentRow.class_id) : null;

    return {
      ...payment,
      amount: Number(payment.amount || 0),
      received_by_name: payment.received_by_profile_id ? receiversById.get(payment.received_by_profile_id) || null : null,
      challan: challan ? {
        ...challan,
        subtotal: Number(challan.subtotal || 0),
        discount_amount: Number(challan.discount_amount || 0),
        deposit_amount: Number(challan.deposit_amount || 0),
        total_amount: Number(challan.total_amount || 0),
        due_amount: Number(challan.due_amount || 0),
        late_fee_amount: Number(challan.late_fee_amount || 0),
        payable_after_due_date: Number(challan.payable_after_due_date || 0),
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
        items: [],
      } : undefined,
    };
  });
}

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const profile = await getCurrentProfile(auth);
    if (!profile?.id) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    let query = auth.supabase.from('fee_payments').select(PAYMENT_COLUMNS).order('payment_date', { ascending: false }).order('created_at', { ascending: false });

    const challanId = request.nextUrl.searchParams.get('challan_id');
    if (challanId) query = query.eq('challan_id', challanId);

    if (auth.role === 'PARENT') {
      const { data: children, error } = await auth.supabase.from('students').select('id').eq('parent_profile_id', profile.id);
      if (error) throw new Error(error.message);
      const childIds = (children || []).map((child) => child.id);
      if (!childIds.length) return NextResponse.json({ payments: [] });
      query = query.in('student_id', childIds);
    } else if (auth.role === 'STUDENT') {
      const { data: student, error } = await auth.supabase.from('students').select('id').eq('user_profile_id', profile.id).maybeSingle();
      if (error) throw new Error(error.message);
      if (!student?.id) return NextResponse.json({ payments: [] });
      query = query.eq('student_id', student.id);
    } else if (!canManageFees(auth.role)) {
      return NextResponse.json({ error: 'Only linked students, parents, and school admins can view fee payments.' }, { status: 403 });
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return NextResponse.json({ payments: await decoratePayments(auth, data || []) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load fee payments.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!canManageFees(auth.role)) return NextResponse.json({ error: 'Only school admins can record fee payments.' }, { status: 403 });

  const payload = cleanPaymentPayload(await request.json());
  const validationError = validatePaymentPayload(payload);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  try {
    const profile = await getCurrentProfile(auth);
    if (!profile?.id) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const { data: challan, error: challanError } = await auth.supabase
      .from('fee_challans')
      .select(CHALLAN_COLUMNS)
      .eq('id', payload.challan_id)
      .single();
    if (challanError) throw new Error(challanError.message);
    if (challan.status === 'cancelled') return NextResponse.json({ error: 'Cancelled challans cannot receive payments.' }, { status: 400 });
    if (Number(challan.due_amount || 0) <= 0) return NextResponse.json({ error: 'This challan is already fully paid.' }, { status: 400 });
    if (payload.amount > Number(challan.due_amount || 0)) return NextResponse.json({ error: 'Payment amount cannot exceed the remaining due amount.' }, { status: 400 });

    const { data: payment, error: paymentError } = await auth.supabase
      .from('fee_payments')
      .insert({
        receipt_number: generateReceiptNumber(challan.challan_number),
        challan_id: challan.id,
        student_id: challan.student_id,
        parent_profile_id: challan.parent_profile_id,
        branch_id: challan.branch_id,
        class_id: challan.class_id,
        amount: payload.amount,
        payment_method: payload.payment_method,
        payment_date: payload.payment_date,
        received_from: payload.received_from || '',
        reference_number: payload.reference_number || '',
        notes: payload.notes || '',
        received_by_profile_id: profile.id,
      })
      .select(PAYMENT_COLUMNS)
      .single();
    if (paymentError) throw new Error(paymentError.message);

    const newDepositAmount = Number(challan.deposit_amount || 0) + payload.amount;
    const newDueAmount = Math.max(0, Number(challan.total_amount || 0) - newDepositAmount);
    const nextStatus = newDueAmount === 0 ? 'paid' : 'partial';

    const { data: updatedChallan, error: updateError } = await auth.supabase
      .from('fee_challans')
      .update({
        deposit_amount: newDepositAmount,
        due_amount: newDueAmount,
        payable_after_due_date: newDueAmount > 0 ? newDueAmount + Number(challan.late_fee_amount || 0) : 0,
        status: nextStatus,
      })
      .eq('id', challan.id)
      .select(CHALLAN_COLUMNS)
      .single();
    if (updateError) throw new Error(updateError.message);

    const [decoratedPayment] = await decoratePayments(auth, [payment]);
    return NextResponse.json({ payment: decoratedPayment, challan: updatedChallan }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to record fee payment.' }, { status: 500 });
  }
}
