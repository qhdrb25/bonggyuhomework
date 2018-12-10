var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var board = require('./routes/board');
var member = require('./routes/members');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/board', board);
app.use('/members', member);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var http = require('http');
app.set('port', 3000);
var server = http.createServer(app);

server.listen(app.get('port'));

console.log('서버가 ' + app.get('port') + '번 포트에서 실행중입니다.!!!');

module.exports = app;


/*
 CREATE TABLE `member` (
 `id` varchar(12) NOT NULL,
 `passwd` varchar(12) NOT NULL,
 `name` varchar(10) NOT NULL,
 `email` varchar(50) NOT NULL,
 `tel` varchar(13) NOT NULL,
 `address` varchar(50) DEFAULT NULL,
 `job` varchar(20) DEFAULT NULL,
 `gender` char(1) NOT NULL,
 `birth` varchar(8) DEFAULT NULL,
 `regdate` datetime DEFAULT NULL,
 `modidate` datetime DEFAULT NULL,
 `withdraw` char(1) NOT NULL DEFAULT 'N',
 PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


 CREATE TABLE `board` (
 `num` int(11) NOT NULL AUTO_INCREMENT,
 `title` varchar(50) NOT NULL,
 `content` varchar(5000) NOT NULL,
 `passwd` varchar(12) NOT NULL,
 `regdate` datetime NOT NULL,
 `hit` int(11) NOT NULL DEFAULT '0',
 `reply` int(11) NOT NULL DEFAULT '0',
 `recmd` int(11) NOT NULL DEFAULT '0',
 `id` varchar(12) NOT NULL,
 PRIMARY KEY (`num`),
 KEY `fk_board_member_idx` (`id`),
 CONSTRAINT `fk_board_member` FOREIGN KEY (`id`) REFERENCES `member` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;



 CREATE TABLE `reply` (
 `rep_num` int(11) NOT NULL AUTO_INCREMENT,
 `rep_content` varchar(1000) NOT NULL,
 `rep_date` datetime DEFAULT NULL,
 `num` int(11) NOT NULL,
 `id` varchar(12) NOT NULL,
 PRIMARY KEY (`rep_num`),
 KEY `fk_reply_board1_idx` (`num`),
 KEY `fk_reply_member1_idx` (`id`),
 CONSTRAINT `fk_reply_board1` FOREIGN KEY (`num`) REFERENCES `board` (`num`) ON DELETE NO ACTION ON UPDATE NO ACTION,
 CONSTRAINT `fk_reply_member1` FOREIGN KEY (`id`) REFERENCES `member` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


 */
