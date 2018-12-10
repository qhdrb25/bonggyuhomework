var express = require('express');
var router = express.Router();
var db_member = require('../models/db_member');

/* GET users listing. */

router.get('/', function (req, res, next) {
  res.render('member', {title : '회원관리'});
});

router.get('/join', function(req, res, next) { // member/join
  res.render('member/join', { title :'회원가입' });
});

router.post('/join', function (req, res, next) {
  console.log('req.body', req.body);
  // id, passwd, name, email, tel, address, job, gender, birth, regdate, modidate, withdraw

  var id = req.body.id;
  var passwd = req.body.passwd;
  var name = req.body.name;
  var email = req.body.email;
  var tel = req.body.tel;
  var address = req.body.address;
  var job = req.body.job;
  var gender = req.body.gender;
  var birth = req.body.birth;

  var datas = [id, passwd, name, email, tel, address, job, gender, birth];
  db_member.join(datas, function (callback) {
    if(callback == false) {
      res.end('<head><meta charset="utf-8">' +
      '<script> alert("에러가 발생해서 되돌아갑니다!"); history.back(); </script></head>');
    }else {
      res.redirect('/members/login');
    }
  });
});

router.get('/login', function (req, res, next) {
  res.render('member/login', { title : '로그인'});
});

router.post('/login', function (req, res, next){
  console.log('req.body', req.body);
  var datas = [req.body.id, req.body.passwd];

  //res.json({ "result" : "success" });  // Dummy Server
  db_member.login(datas, function (callback) {
    if(!callback) {
      res.end('<head><meta charset="utf-8"><script> alert("에러가 발생해서 되돌아갑니다!"); ' +
      'history.back(); </script></head>');
    }else{
      res.render('member/main', {"title" : "개인 메뉴", "id" : req.body.id});
    }
  });
});

router.get('/update/:id', function (req, res, next) {
  console.log('req.params.id', req.params.id);
  //res.json({id : req.params.id});
  var datas = [req.params.id];

  db_member.updateform(datas, function (data) {
    console.log("data", data);
    if(data)
      res.render('member/updateform', {"title" : "정보 수정", "row" : data})
  });
});

router.post('/update/:id', function (req, res, next) {
  //var id = req.params.id;
  console.log("req.body", req.body);
  var id = req.body.id;
  var passwd = req.body.passwd;
  var name = req.body.name;
  var email = req.body.email;
  var tel = req.body.tel;
  var address = req.body.address;
  var job = req.body.job;
  var gender = req.body.gender;
  var birth = req.body.birth;

  var datas = [name, email, tel, address, job, gender, birth, id, passwd];

  db_member.update(datas, function (callback) {
    if (callback) {
      res.render('member/main', {"title" : "회원관리", "id" : id});
    }else{
      res.end('<head><meta charset="utf-8"><script> alert("에러가 발생해서 되돌아갑니다!"); ' +
      'history.back(); </script></head>');
    }
  })
});

router.get('/withdraw/:id', function (req, res, next){
  var id = req.params.id;
  res.render('member/withdrawform', {"id" : id, "title" : "회원 탈퇴"});
});

router.post('/withdraw/:id', function (req, res, next){
  var id = req.body.id;
  var passwd = req.body.passwd;
  var datas = [id, passwd];

  db_member.withdraw(datas, function (callback) {
    if (callback) {
      res.end('<head><meta charset="utf-8"><script> alert("탈퇴되었습니다.");' +
      'location.href="/members"; </script></head>');
    } else {
      res.end('<head><meta charset="utf-8"><script> alert("에러가 발생해서 되돌아갑니다!"); ' +
      'history.back(); </script></head>');
    }
  })
});


module.exports = router;

