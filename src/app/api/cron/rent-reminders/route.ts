import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendNotification } from '@/lib/notifications/dispatcher';
import { RentReminderEmail } from '@/emails/RentReminderEmail';
import { format, addDays } from 'date-fns';

export async function GET(request: Request) {
  // Simple cron secret check to prevent unauthorized execution
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();

  // Find payments due exactly 7 days from now that are still PENDING
  const targetDate = addDays(new Date(), 7).toISOString().split('T')[0];

  const { data: upcomingPayments, error } = await supabase
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
    .eq('due_date', targetDate);

  if (error) {
    console.error('[CRON Error] Failed to fetch upcoming payments:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let successCount = 0;

  for (const payment of upcomingPayments) {
    if (!payment.tenant) continue;
    
    const tenant: any = Array.isArray(payment.tenant) ? payment.tenant[0] : payment.tenant;
    
    // We send notifications to the tenant's email address
    const emailTo = tenant?.email;
    const phoneTo = tenant?.phone;

    if (!emailTo) continue;

    const formattedAmount = Number(payment.amount).toFixed(2);
    const apartment: any = Array.isArray(tenant?.apartment) ? tenant.apartment[0] : tenant?.apartment;
    const unitName = apartment?.unit_name || "your unit";
    const paymentLabel = payment.type === "RENT" ? "Rent" : payment.type === "UTILITY" ? "Utility Bill" : "Payment";

    const emailComponent = RentReminderEmail({
       tenantName: emailTo.split('@')[0],
       unitName: unitName,
       amountDue: Number(formattedAmount),
       dueDate: format(new Date(payment.due_date), "MMMM do, yyyy"),
       paymentUrl: "https://pilasproperties.com/tenant/payments" // Replace with actual live domain in prod
    });

    const smsMessage = `PILAS Properties: Your ${paymentLabel} for ${unitName} (GH₵ ${formattedAmount}) is due on ${format(new Date(payment.due_date), "MMM do")}. Login to your portal to view details.`;

    await sendNotification({
       to: { email: emailTo, phone: phoneTo },
       subject: `Upcoming PILAS Properties ${paymentLabel} Due - 7 Days`,
       emailComponent,
       smsMessage
    });

    successCount++;
  }

  return NextResponse.json({
    message: `Processed ${upcomingPayments.length} upcoming payments. Sent ${successCount} reminders.`
  });
}
