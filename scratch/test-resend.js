import { Resend } from 'resend';

try {
  const resend = new Resend(undefined);
  console.log('Resend initialized successfully with undefined');
} catch (error) {
  console.error('Resend failed to initialize with undefined:', error.message);
}
