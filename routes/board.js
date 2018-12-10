/**
 * Created by ProgrammingPearls on 15. 4. 9..
 */

var express = require('express');
var router = express.Router();
var db_board = require('../models/db_board');

/* GET board listing. */
router.get('/', function(req, res, next) {
  res.render('board', { "title" : '게시판' });
});

router.get('/write', function (req, res, next) {
  res.render('board/writeform', { "title" : "글쓰기" });
});

router.post('/write', function (req, res, next) {
  console.log('req.body', req.body);

  var title = req.body.title;
  var content = req.body.content;
  var passwd = req.body.passwd;

  var datas = [title, content, passwd];

  //res.json({"result" : "success"});

  db_board.write(datas, function (success) {

    if (!success)
      //res.json({"result" : "fail"});  // 모바일 서버일 경우
      res.end('<head><meta charset="UTF-8">' +
               '<script>alert("에러가 발생하여 되돌아갑니다.");history.back();</script> </head>');
    else {
      //res.json({"result" : "success"});  // 모바일 서버일 경우
      res.redirect('/board/list/1');
    }
  });
});

router.get('/list', function (req, res, next) {
  res.redirect('/board/list/1');
});

router.get('/list/:page', function (req, res, next) {
  var page = req.params.page;
  page = parseInt(page, 10);

  console.log(page);
  db_board.list(page, function (datas) {
    res.render('board/list', datas);
  });
});


router.get('/write300', function (req, res) {

  for (var i = 1; i <=300; i++) {
    var title = i + "번째 글 입니다.";
    var content = i * Math.floor(200 * Math.random());
    var passwd = '1234';
    var datas = [title, content, passwd];

    db_board.write(datas, function (success) {

    });
  }

  res.send('<head><meta charset="utf-8"></head><script>alert("300개의 글이 생성되었습니다."></script>');
});

router.get('/read/:page/:num', function (req, res, next) {
  var page = req.params.page;
  var num = req.params.num;

  db_board.read(num, function (data) {
    //res.json({"result" : data});
    res.render('board/read', {"title" : "글 읽기", "data" : data, "page" : page});
  });
});

router.get('/update/:page/:num', function (req, res, next) {
  var page = req.params.page;
  var num = req.params.num;

  db_board.updateform(num, function (data) {
    res.render('board/updateform', {"title" : "수정하기", "data" : data, "page" : page});
  });
});

router.post('/update', function (req, res, next) {
  //console.log("req.body", req.body);
  var page = req.body.page;
  var datas = [req.body.title, req.body.content, req.body.num, req.body.passwd];

  db_board.update(datas, function (data) {
    //res.json({result : data});
    res.redirect('/board/list/' + page);
    //res.render('updateform', {"title" : "수정하기", "data" : data, "page" : page});
  })
});

router.post('/delete', function (req, res, next) {
  console.log('req.body', req.body);
  var num = req.body.num;
  var page = req.body.page;
  var passwd = req.body.passwd;

  var datas = [num, passwd];

  db_board.delete(datas, function (data) {
    //res.json({result : data});
    if (data){
      res.redirect('/board/list/'+page);
    } else {
      res.end('<head><meta charset="utf-8"><script>alert("비밀번호가 틀려서 되돌아갑니다.");history.back();</script></head>');
    }
  });
});

module.exports = router;
