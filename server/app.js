const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const setupSwagger = require('./config/swagger');
const devLogger = require('./utils/logger');

//routers
const authRouter = require('./routes/authRoutes');
const sessionsRouter = require('./routes/sessionRoutes');
const enrolmentsRouter = require('./routes/enrollmentRoutes');
const certificatesRouter = require('./routes/certificateRoutes');
const trainersRouter = require('./routes/trainersRoutes');
const adminRouter = require('./routes/adminRoutes');
const certificateTestRouter = require('./routes/certificateTestRouter');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//swagger config
setupSwagger(app);


//route end points
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/sessions', sessionsRouter);
app.use('/api/v1/enrolments', enrolmentsRouter);
app.use('/api/v1/certificates', certificatesRouter);
app.use('/api/v1/trainers', trainersRouter);
app.use('/api/v1/admin', adminRouter);

//pdf certificates test route 
app.use('/api/v1/test/certificates', certificateTestRouter);


// Health check'
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

//pdf generator test
app.get('/api/v1/pdf/debug', async (req, res) => {

  try {

    const example = require('./utils/pdf/templates/example');
    const {generatePdf} = require('./utils/pdf/service/pdfGenerator');
    const data = {
      name: 'John Doe',
      age: 34,
      reportId: 'RPT-2024-001',
      results: [
        { test: 'Glucose', result: 'Normal', normalRange: '70-99 mg/dL' },
        { test: 'HB', result: '13.5', normalRange: '13.5-17.5 g/dL' },
        { test: 'Cholesterol', result: '190', normalRange: '<200 mg/dL' }
      ]
    };

    const html = example(data);
    const pdfBuffer = await generatePdf(html);

    res.writeHead(200, {
      'Content-Type': 'application/pdf',

      'Content-Length': pdfBuffer.length,

      'Content-Disposition':
        'inline; filename="debug.pdf"',
    });
    res.end(pdfBuffer);

  } catch (error) {

    console.error(
      'PDF generation failed:',
      error
    );

    res.status(500).send(error.message);
  }
});
//  404 error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //  error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(process.env.PORT,'localhost',()=>{
  devLogger.info(`\n Server is running! on port ${process.env.PORT}`);
  devLogger.info(`API URL: http://localhost:${process.env.PORT}/api`);
  devLogger.info(` Swagger UI: http://localhost:${process.env.PORT}/api-docs`);
  devLogger.info(` Swagger UI: http://localhost:${process.env.PORT}/swagger.json`);
  devLogger.info(` Health check: http://localhost:${process.env.PORT}/api/v1/health\n`);
})
module.exports = app;
