var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var baiVietRouter = require('./routes/BaiViet');
var nguoiDungRouter = require('./routes/NguoiDung');
var binhLuanRouter = require('./routes/BinhLuan');
var tuongTacRouter = require('./routes/TuongTac');
var theoDoiRouter = require('./routes/TheoDoi');
var thongBaoRouter = require('./routes/ThongBao');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/BaiViet', baiVietRouter);
app.use('/NguoiDung', nguoiDungRouter);
app.use('/BaiViet/BinhLuan', binhLuanRouter);
app.use('/BaiViet/TuongTac', tuongTacRouter);
app.use('/NguoiDung/TheoDoi', theoDoiRouter);
app.use('/ThongBao', thongBaoRouter);

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
