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

interface RentReminderEmailProps {
  tenantName: string;
  unitName: string;
  amountDue: number;
  dueDate: string;
  paymentUrl: string;
}

export const RentReminderEmail = ({
  tenantName = "Valued Tenant",
  unitName = "Your Apartment",
  amountDue = 0,
  dueDate = "the 1st",
  paymentUrl = "#",
}: RentReminderEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Upcoming rent payment reminder for {unitName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Upcoming Payment Reminder</Heading>
          
          <Text style={text}>
            Hello {tenantName},
          </Text>
          
          <Text style={text}>
            This is a friendly reminder from PILAS Properties that your upcoming rent and utilities for <strong>{unitName}</strong> will be due soon.
          </Text>

          <Section style={section}>
             <div style={invoiceBox}>
                <Text style={invoiceLabel}>Amount Due:</Text>
                <Text style={invoiceAmount}>GH₵ {amountDue}</Text>
                <Text style={invoiceLabel}>Due Date:</Text>
                <Text style={invoiceDate}>{dueDate}</Text>
             </div>
          </Section>

          <Section style={buttonContainer}>
            <Button
              style={btn}
              href={paymentUrl}
            >
              View Invoice & Pay
            </Button>
          </Section>

          <Text style={footer}>
            If you have already submitted your payment, please disregard this notice. 
            For any questions or concerns, contact administration via the tenant portal.
            <br /><br />
            — PILAS Properties Management
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default RentReminderEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
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
  margin: '24px 0',
};

const invoiceBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
};

const invoiceLabel = {
  color: '#64748b',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 4px',
};

const invoiceAmount = {
  color: '#0f172a',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const invoiceDate = {
  color: '#334155',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
};

const buttonContainer = {
  padding: '12px 48px',
  textAlign: 'center' as const,
};

const btn = {
  backgroundColor: '#2563eb',
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
