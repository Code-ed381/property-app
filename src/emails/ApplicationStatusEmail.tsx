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

interface ApplicationStatusEmailProps {
  applicantName: string;
  unitName: string;
  status: "APPROVED" | "REJECTED";
  portalUrl: string;
}

export const ApplicationStatusEmail = ({
  applicantName = "Valued Applicant",
  unitName = "Your Apartment",
  status = "APPROVED",
  portalUrl = "#",
}: ApplicationStatusEmailProps) => {
  const isApproved = status === "APPROVED";
  
  return (
    <Html>
      <Head />
      <Preview>Update on your application for {unitName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Application {isApproved ? "Approved!" : "Update"}</Heading>
          
          <Text style={text}>
            Hello {applicantName},
          </Text>
          
          {isApproved ? (
            <>
              <Text style={text}>
                Congratulations! We are thrilled to inform you that your application for <strong>{unitName}</strong> has been fully approved by the PILAS Properties management team.
              </Text>
              <Section style={section}>
                 <Text style={text}>
                   Your next step is to log into the Tenant Portal to review and sign your official Tenancy Agreement.
                 </Text>
              </Section>
              <Section style={buttonContainer}>
                <Button style={btnApproved} href={portalUrl}>
                  Access Tenant Portal
                </Button>
              </Section>
            </>
          ) : (
             <>
               <Text style={text}>
                 Thank you for applying to lease <strong>{unitName}</strong>. 
                 We have carefully reviewed your application, but unfortunately, we are unable to approve it at this time.
               </Text>
               <Section style={section}>
                 <Text style={text}>
                   We wish you the best in your housing search. If you have any questions, you may contact our leasing office.
                 </Text>
               </Section>
             </>
          )}

          <Text style={footer}>
            — PILAS Properties Management
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ApplicationStatusEmail;

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

const buttonContainer = {
  padding: '12px 48px',
  textAlign: 'center' as const,
};

const btnApproved = {
  backgroundColor: '#10b981', // emerald-500
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
