import { Resend } from 'resend';

// Initialize with a dummy key for development to avoid errors
// In production, this needs a valid Resend API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_1234567890');

export default resend;
