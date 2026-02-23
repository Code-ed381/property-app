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

interface MaintenanceUpdateEmailProps {
  tenantName: string;
  unitName: string;
  ticketTitle: string;
  status: string;
  portalUrl: string;
}

export const MaintenanceUpdateEmail = ({
  tenantName = "Valued Tenant",
  unitName = "Your Apartment",
  ticketTitle = "Maintenance Request",
  status = "Pending",
  portalUrl = "#",
}: MaintenanceUpdateEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Status Update for Maintenance: {ticketTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Maintenance Update</Heading>
          
          <Text style={text}>
            Hello {tenantName},
          </Text>
          
          <Text style={text}>
            This is an automated notification regarding your work order at <strong>{unitName}</strong>. 
            The status for your ticket has recently been updated by the management team.
          </Text>

          <Section style={section}>
             <div style={statusBox}>
                <Text style={statusLabel}>Ticket Title:</Text>
                <Text style={statusValue}>{ticketTitle}</Text>
                <Text style={statusLabel}>New Status:</Text>
                <Text style={statusValueEmph}>{status}</Text>
             </div>
          </Section>

          <Section style={buttonContainer}>
            <Button style={btn} href={portalUrl}>
              View Work Order
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

export default MaintenanceUpdateEmail;

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
  margin: '24px 0',
};

const statusBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
};

const statusLabel = {
  color: '#64748b',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 4px',
};

const statusValue = {
  color: '#0f172a',
  fontSize: '18px',
  margin: '0 0 16px',
};

const statusValueEmph = {
  color: '#2563eb', // blue-600
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  textTransform: 'capitalize' as const,
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
