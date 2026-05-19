const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const setupSwagger = require('./config/swagger');
const authRouter=require('./routes/authRoutes')
const sessionsRouter=require('./routes/sessionRoutes')
const enrolmentsRouter=require('./routes/enrollmentRoutes')
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


//routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/sessions', sessionsRouter);
app.use('/api/v1/enrolments',enrolmentsRouter)


// Health check'
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(process.env.PORT,'localhost',()=>{
  console.log(`\n Server is running! on port ${process.env.PORT}`);
  console.log(`API URL: http://localhost:${process.env.PORT}/api`);
  console.log(` Swagger UI: http://localhost:${process.env.PORT}/api-docs`);
  console.log(` Swagger UI: http://localhost:${process.env.PORT}/swagger.json`);
  console.log(` Health check: http://localhost:${process.env.PORT}/api/v1/health\n`);
})
module.exports = app;
