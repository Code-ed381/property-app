import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Button
} from '@react-email/components';
import * as React from 'react';

interface LeaseExpiringEmailProps {
  tenantName: string;
  unitName: string;
  expiryDate: string;
  daysRemaining: number;
  portalUrl: string;
}

export const LeaseExpiringEmail = ({
  tenantName = "Valued Tenant",
  unitName = "Your Apartment",
  expiryDate = "January 1st, 2025",
  daysRemaining = 30,
  portalUrl = "#",
}: LeaseExpiringEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your lease for {unitName} expires in {String(daysRemaining)} days</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Lease Expiration Notice</Heading>
          
          <Text style={text}>
            Hello {tenantName},
          </Text>
          
          <Text style={text}>
            This is a formal notice that your current Tenancy Agreement for <strong>{unitName}</strong> is scheduled to expire on <strong>{expiryDate}</strong> ({daysRemaining} days from now).
          </Text>

          <Section style={section}>
             <Text style={text}>
               If you wish to renew your lease, please contact management immediately to begin the renewal process. 
               If you plan to vacate, please ensure that you follow the proper move-out procedures outlined in your agreement.
             </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={btn} href={portalUrl}>
              Contact Management
            </Button>
          </Section>

          <Text style={footer}>
            — PILAS Properties Management
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default LeaseExpiringEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0 48px',
  margin: '30px 0',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 48px',
  margin: '16px 0',
};

const section = {
  padding: '0 48px',
};

const buttonContainer = {
  padding: '24px 48px',
  textAlign: 'center' as const,
};

const btn = {
  backgroundColor: '#f59e0b', // amber-500
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
  padding: '12px 20px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 48px',
  marginTop: '32px',
};
