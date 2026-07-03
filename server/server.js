const app=require('./app')
const dotenv=require('dotenv').config()
const devLogger=require('./utils/logger')
const {sendTestEmail}=require('./utils/email/emailServices/emailService')
const {verifyMailer}= require('./config/mailer')

app.listen(process.env.PORT,'localhost',()=>{
  devLogger.info(`\n Server is running! on port ${process.env.PORT}`);
  devLogger.info(`API URL: http://localhost:${process.env.PORT}/api`);
  devLogger.info(` Swagger UI: http://localhost:${process.env.PORT}/api-docs`);
  devLogger.info(` Swagger UI: http://localhost:${process.env.PORT}/swagger.json`);
  devLogger.info(` Health check: http://localhost:${process.env.PORT}/api/v1/health\n`);
devLogger.info(' Auth info available at: http://localhost:3000/api-docs/auth-info');

verifyMailer()

 if (process.env.SEND_TEST_EMAIL === 'true') {
    const recipient = process.env.TEST_EMAIL_RECIPIENT || 'test@example.com';
    sendTestEmail(recipient).catch(err => {
      devLogger.error('Failed to send test email:', err.message);
    });
  }
  
})