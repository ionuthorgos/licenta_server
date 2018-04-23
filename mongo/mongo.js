const mongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://localhost:27017/polyglot_ninja";


module.exports = function (app) {
  //this.db = yield mongoClient.connect(MONGO_URL);
  //this.logs = this.db.collection('logs');


  // MongoClient.connect(MONGO_URL)
    //     .then((err, connection) => {
    //         app.people = connection.collection("people");
    //         console.log("Database connection established")
    //     })
    //     .catch((err) => console.error(err))

  mongoClient.connect(MONGO_URL,(err,database) =>{
    if (err) return console.log(err);
  console.log("conected");
    const db = database.db('onlinecoding')
    app.db  = db;
    app.people = db.collection("people");
  app.categoryTable = db.collection("category");
    //console.log("OKKKKKKKKKKKKKKKK");
  })
};
