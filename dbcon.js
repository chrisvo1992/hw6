var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host  : 'classmysql.engr.oregonstate.edu',
  user  : 'cs290_vochr',
  password: '9670',
  database: 'cs290_vochr'
});

module.exports.pool = pool;