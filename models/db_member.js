/**
 * Created by ProgrammingPearls on 15. 4. 17..
 */
var mysql = require('mysql');
var config = require('../models/db_config');
var pool = mysql.createPool(config);

exports.join = function (datas, callback) {
  pool.getConnection(function(err, conn){
    if (err) {
      console.log('err', err);
      res.json(err);
    }
    else {
      var sql = 'insert into member(id, passwd, name, email, tel, address, ' +
        'job, gender, birth, regdate, modidate, withdraw) ' +
        'values(?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now(), "N")';
      // var data = [id, passwd, name, email, tel, address, job, gender, birth];
      var success = false;

      conn.query(sql, datas, function (err, row) {
        if (err) {
          console.log('err', err);
          res.json(err);
          // connection을 되돌려줘야한다!! 중요!
          conn.release();
        }
        else {
          console.log('row', row);
          if (row.affectedRows == 1) {
            success = true;
          }
          // connection을 되돌려줘야한다!! 중요!
          callback(success);
          conn.release();
        }
      });
    }
  });
};

exports.login = function (datas, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log("err", err);
    }
    else {
      var success = false;
      var sql = 'select count(*) cnt from member where id=? and passwd=?';
      conn.query(sql, datas, function (err, rows) {
        if (err) {
          console.log("err", err);
          res.json({"result": err});
          next(err);
          conn.release();
          return;
        }
        else {
          console.log("rows", rows);
          if (rows[0].cnt == 1)
            success = true;
        }
        callback(success);
        conn.release();
      });
    }
  });
}

exports.updateform = function (datas, callback) {
  pool.getConnection(function (err, conn) {
    if(err){
      console.log(err);
      res.json({"result" : err});
      return;
    }
    else {
      var sql = "select id, passwd, name, email, tel, address, job, gender, birth from member " +
        "where id = ?";
      conn.query(sql, datas, function (err, rows) {
        console.log('rows', rows);
        if (rows) {
          var row = rows[0];
          var tel = row.tel.split('-');
          row.tel1 = tel[0];
          row.tel2 = tel[1];
          row.tel3 = tel[2];
          console.log('row', row);
        }
        callback(row);
        conn.release();
      });
    }
  });
};

exports.update = function (datas, callback) {
  pool.getConnection(function(err, conn){
    var sql = "update member set name=?, email=?, tel=?, address=?, job=?, gender=?, " +
      "birth=?, modidate=now() where id=? and passwd=?";

    conn.query(sql, datas, function (err, row) {
      var success = false;
      if(err) console.log('err', err);
      else {
        if(row.affectedRows == 1)
          success = true;
      }
      callback(success);
      conn.release();
    });
  });
};

exports.withdraw = function (datas, callback) {
  pool.getConnection(function(err, conn){
    if(err) console.log('err', err);
    else {
      var success = false;
      var sql = "update member set withdraw='Y' where id=? and passwd=?";
      conn.query(sql, datas, function(err, row){
        if (err) console.log('err', err);
        else {
          if (row.affectedRows == 1)
            success = true;
        }
        callback(success);
        conn.release();
      });
    }
  });
};