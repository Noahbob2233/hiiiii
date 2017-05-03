var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'zelda-botw'
});

module.exports = {
  Select: function() {
    connection.connect();

	connection.query('SELECT * FROM ArmasMelee;', function (error, results, fields) {
	  if (error) throw error;
	  console.log(results[0].damage);
	  return results;
	});

	connection.end();
  },
  Insert: function(col, query) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, db) {
        if (err) {
          reject(err);  
        } else {
          resolve(db);
        }
      });
    }).then(function(db) {
      return new Promise(function(resolve, reject) {
        var collection = db.collection(col);
        collection.insert(query, function(err, db){
          if (err) {
            reject(err);
          } else {
            resolve(db);
          }
        });
      });
    });
  }
};