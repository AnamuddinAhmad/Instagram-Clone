const createError = require('http-errors');
const express = require('express');
const path = require('path');
require("dotenv").config();
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSession = require('express-session');

const indexRouter = require('./routes/index');
const userModel = require('./models/user_Model');
const passport = require('passport');

//Rquireing Connection

const db = require("./config/mongooseConnection");
const app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Routes
app.use('/', indexRouter);

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

module.exports = app;
