import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendNotification } from '@/lib/notifications/dispatcher';
import { LeaseExpiringEmail } from '@/emails/LeaseExpiringEmail';
import { format, addDays, differenceInDays } from 'date-fns';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();

  // Find agreements nearing the end of their lease (e.g. within 30 days)
  const thirtyDaysOut = addDays(new Date(), 30).toISOString().split('T')[0];

  const { data: expiringAgreements, error } = await supabase
    .from('agreements')
    .select(`
      id,
      lease_end,
      status,
      tenant:tenants (
        email,
        phone,
        apartment:apartments (
          unit_name
        )
      )
    `)
    .eq('status', 'SIGNED')
    .lte('lease_end', thirtyDaysOut);

  if (error) {
    console.error('[CRON Error] Failed to fetch expiring agreements:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let successCount = 0;

  for (const agreement of expiringAgreements) {
    if (!agreement.tenant) continue;
    
    const tenant: any = Array.isArray(agreement.tenant) ? agreement.tenant[0] : agreement.tenant;
    const emailTo = tenant?.email;
    const phoneTo = tenant?.phone;

    if (!emailTo) continue;

    const apartment: any = Array.isArray(tenant?.apartment) ? tenant.apartment[0] : tenant?.apartment;
    const unitName = apartment?.unit_name || "your unit";
    const daysLeft = differenceInDays(new Date(agreement.lease_end), new Date());
    
    // Only send exactly at the 30 day mark for spam prevention
    if (daysLeft !== 30) continue;

    const emailComponent = LeaseExpiringEmail({
       tenantName: emailTo.split('@')[0],
       unitName: unitName,
       expiryDate: format(new Date(agreement.lease_end), "MMMM do, yyyy"),
       daysRemaining: daysLeft,
       portalUrl: "https://pilasproperties.com/tenant"
    });

    const smsMessage = `PILAS Properties: Your lease for ${unitName} expires in exactly 30 days. Please contact management soon if you plan to renew.`;

    await sendNotification({
       to: { email: emailTo, phone: phoneTo },
       subject: `Lease Expiration Notice (30 Days) - PILAS Properties`,
       emailComponent,
       smsMessage
    });

    successCount++;
  }

  return NextResponse.json({
    message: `Processed ${expiringAgreements.length} nearing agreements. Sent ${successCount} exact 30-day notices.`
  });
}
