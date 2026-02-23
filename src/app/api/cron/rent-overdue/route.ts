import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendNotification } from '@/lib/notifications/dispatcher';
import { RentReminderEmail } from '@/emails/RentReminderEmail';
import { format } from 'date-fns';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();

  // Find all payments that are strictly past their due_date and still PENDING
  const targetDate = new Date().toISOString().split('T')[0];

  const { data: overduePayments, error } = await supabase
    .from('payments')
    .select(`
      id,
      amount,
      due_date,
      type,
      tenant:tenants (
        email,
        phone,
        apartment:apartments (
          unit_name
        )
      )
    `)
    .eq('status', 'PENDING')
    .lt('due_date', targetDate); // Strictly less than today

  if (error) {
    console.error('[CRON Error] Failed to fetch overdue payments:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let successCount = 0;

  for (const payment of overduePayments) {
    if (!payment.tenant) continue;
    
    const tenant: any = Array.isArray(payment.tenant) ? payment.tenant[0] : payment.tenant;
    const emailTo = tenant?.email;
    const phoneTo = tenant?.phone;

    if (!emailTo) continue;

    const formattedAmount = Number(payment.amount).toFixed(2);
    const apartment: any = Array.isArray(tenant?.apartment) ? tenant.apartment[0] : tenant?.apartment;
    const unitName = apartment?.unit_name || "your unit";
    const paymentLabel = payment.type === "RENT" ? "Rent" : payment.type === "UTILITY" ? "Utility Bill" : "Payment";

    // Reusing the rent reminder email template but you could make an overdue specific one
    const emailComponent = RentReminderEmail({
       tenantName: emailTo.split('@')[0],
       unitName: unitName,
       amountDue: Number(formattedAmount),
       dueDate: format(new Date(payment.due_date), "MMMM do, yyyy") + " (OVERDUE)",
       paymentUrl: "https://pilasproperties.com/tenant/payments"
    });

    const smsMessage = `URGENT: Your PILAS Properties ${paymentLabel} for ${unitName} (GH₵ ${formattedAmount}) is OVERDUE. Please log in immediately and settle your invoice.`;

    await sendNotification({
       to: { email: emailTo, phone: phoneTo },
       subject: `URGENT: OVERDUE PILAS Properties ${paymentLabel}`,
       emailComponent,
       smsMessage
    });

    // Option to automatically mark them as OVERDUE instead of PENDING inside Supabase
    await supabase.from('payments').update({ status: 'OVERDUE' }).eq('id', payment.id);

    successCount++;
  }

  return NextResponse.json({
    message: `Processed ${overduePayments.length} overdue payments. Sent ${successCount} reminders.`
  });
}
