/**
 * Created by ProgrammingPearls on 15. 4. 9..
 */

// db_board.js
var mysql = require('mysql');
var config = require('../models/db_config');
var pool = mysql.createPool(config);

exports.write = function (datas, callback) {
  pool.getConnection(function (err, conn) {
    // err : 에러를 가져온다, conn : 결과를 가져온다.
    if (err)
      console.error('err', err);


    var sql = "insert into board(title, content, passwd, regdate, hit, reply, recmd, id) " +
              "values (?, ?, ?, now(), 1, 1, 1, 'hong')";

    conn.query(sql, datas, function (err, row) {
      if (err) console.error('err', err);

      console.log("row", row);

      var success = true;

      conn.release();
      // 요청한 곳에 callback함수를 돌려준다.
      callback(success);
    });
  });
}

/*
 exports.write = function (저장할 내용, 콜백) {

 }
 */

exports.list = function (page, callback) {
  pool.getConnection(function (err, conn) {
    if (err) console.error('err', err);
    var sql = "select count(*) cnt from board";

    conn.query(sql, [], function (err, rows) {
      console.log("rows", rows);  // [ { cnt : 1 } ]
      var size = 10;  // 한 페이지에 보여줄 개수
      var begin = (page - 1) * size; // 시작 글
      var cnt = rows[0].cnt;  // 전체 글의 개수
      var totalPage = Math.ceil(cnt / size);  // 전체 페이지의 수 (75 / 10 = 7.5(X) -> 8(O))
      var pageSize = 10; // 페이지 링크의 개수

      // 1~10페이지는 1로, 11~20페이지는 11로 시작되어야하기 때문에 숫자 첫째자리의 수를 고정시키기 위한 계산법
      var startPage = Math.floor((page-1) / pageSize) * pageSize + 1;
      var endPage = startPage + (pageSize - 1);

      if(endPage > totalPage) {
        endPage = totalPage;
      }

      // 전체 글이 존재하는 개수
      var max = cnt - ((page-1) * size);

      conn.query("select num, title, content, passwd, DATE_FORMAT(regdate, '%Y-%m-%d %H:%i:%s') regdate, hit, reply, recmd, id " +
                 "from board " +
                 "order by num desc " +
                 "limit ?, ?", [begin, size], function (err, rows) {

        if (err) console.err('err', err);

        console.log("rows", rows);
        var datas = {
          "title" : "게시판 리스트",
          "data" : rows,
          "page" : page,
          "pageSize" : pageSize,
          "startPage" : startPage,
          "endPage" : endPage,
          "totalPage" : totalPage,
          "max" : max
        };
        conn.release();
        callback(datas);
      });
    });
  });
}

exports.read = function (num, callback) {
  pool.getConnection(function (err, conn) {
    if (err) console.log('err', err);
    conn.query('update board set hit=hit+1 where num=?', [num], function (err, row) {
      if (err) console.log('err', err);
      conn.query("select num, title, content, passwd, DATE_FORMAT(regdate, '%Y-%m-%d %H:%i:%s') regdate, hit, reply, recmd, id " +
                 "from board " +
                 "where num = ? order by num desc ",[num], function (err, rows) {
        if (err) console.log('err', err);
        conn.release();
        callback(rows[0]);
      });
    });
  });
};

exports.updateform = function (num, callback) {
  pool.getConnection(function (err, conn) {
    if (err) console.log('err',err);
    conn.query("select num, title, content, passwd, DATE_FORMAT(regdate, '%Y-%m-%d %H:%i:%s') regdate, hit, reply, recmd, id " +
    "from board " +
    "where num = ? order by num desc ",[num], function (err, rows) {
      if (err) console.log('err', err);
      conn.release();
      callback(rows[0]);
    });
  });
};

exports.update = function (datas, callback){
  pool.getConnection(function (err, conn) {
    if (err) console.error('err', err);
    var sql = "update board set title=?, content=? where num=? and passwd=?";
    conn.query(sql, datas, function (err, row) {
      if (err) console.error('err', err);

      var success = false;
      if(row.affectedRows == 1) {
        success = true;
      }
      conn.release();
      callback(success);
    });
  });
};

exports.delete = function (datas, callback) {
  pool.getConnection(function (err, conn) {
    if (err) console.log('err', err);
    var sql = 'delete from board where num=? and passwd=?';
    conn.query(sql, datas, function (err, row) {
      if (err) console.error('err', err);
      var success = false;
      if(row.affectedRows == 1) {
        success = true;
      }
      conn.release();
      callback(success);
    });
  });
};
