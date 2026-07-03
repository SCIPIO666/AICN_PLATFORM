const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const setupSwagger = require('./config/swagger');
const devLogger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const { notFoundHandler } = require('./middleware/notFound');
const cors = require('cors');

//routers
const authRouter = require('./routes/authRoutes');
const sessionsRouter = require('./routes/sessionRoutes');
const enrolmentsRouter = require('./routes/enrollmentRoutes');
const certificatesRouter = require('./routes/certificateRoutes');
const trainersRouter = require('./routes/trainersRoutes');
const adminRouter = require('./routes/adminRoutes');
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.options('*', cors());

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


// Health check'
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// 404 handler 
app.use(notFoundHandler);

// Global error handler 
app.use(errorHandler);


module.exports = app;
