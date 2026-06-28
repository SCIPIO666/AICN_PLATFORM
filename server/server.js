const app=require('./app')
const dotenv=require('dotenv').config()
const devLogger=require('./utils/logger')
const {sendTestEmail}=require('./utils/email/email services')
const {verifyMailer}= require('./config/mailer')
app.listen(process.env.PORT,'localhost',()=>{
  devLogger.info(`\n Server is running! on port ${process.env.PORT}`);
  devLogger.info(`API URL: http://localhost:${process.env.PORT}/api`);
  devLogger.info(` Swagger UI: http://localhost:${process.env.PORT}/api-docs`);
  devLogger.info(` Swagger UI: http://localhost:${process.env.PORT}/swagger.json`);
  devLogger.info(` Health check: http://localhost:${process.env.PORT}/api/v1/health\n`);
devLogger.info(' Auth info available at: http://localhost:3000/api-docs/auth-info');
verifyMailer()
sendTestEmail('tsailunenterprises@gmail.com')
  
})