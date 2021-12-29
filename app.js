const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');
const projectRouter = require('./routes/projectRoutes');
const articleRouter = require('./routes/articleRoutes');
const globalErrorHandler = require('./controllers/errorController');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Limit size of HTTP request, parse query strings
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.locals.githubLink = process.env.GITHUB_LINK;
app.locals.resumeLink = process.env.RESUME_LINK;
app.locals.linkedinLink = process.env.LINKEDIN_LINK;

// Route Configuration
app.use('/', viewRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/articles', articleRouter);

// Handle unknown routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}!`, 404));
});

// Any time an error is passed into next, call this global error handler
app.use(globalErrorHandler);

module.exports = app;
