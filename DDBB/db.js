var mysql      = require('mysql');

var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'root',
      database : 'warbo'
    });


connection.connect();

module.exports = {
  Select: function(query_str, query_var) {

    return new Promise(function(resolve, reject) {
      connection.query(query_str, query_var, function (error, results) {
        if (error) throw reject(error);
        resolve(results);
      });
    });

  },
  Insert: function(query_str, query_var) {

    return new Promise(function(resolve, reject) {
      connection.query(query_str, query_var, function (error) {
        if (error) throw reject(error);
        resolve();
      });
    });
  }
}