//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#set-up-our-node-application-(package-json)

var mongo = require('mongodb');
var mongoose = require("mongoose");
var userSchemas = require('./../schemas/user.js')(mongoose);
var questionSchemas = require('./../schemas/questionSchema.js')(mongoose);
// var questionResponseSchemas = require('./../schemas/questionResponse.js')(mongoose);
var questionCategorySchema = require('./../schemas/questionCategory.js')(mongoose);
var newsSchema = require('./../schemas/newsSchema.js')(mongoose);
var exercisesSchema = require('./../schemas/exerciseSchema')(mongoose);

var registerSchema = require('./../schemas/registerSchema')(mongoose);
var categorySchema = require('./../schemas/categorySchema')(mongoose);




var config =  require('../config/development');


var q = require('q');

var dbURI = config.mongodb.url;
var options = {
  user: 'mongouser',
  pass: 'someothersecret'
}

mongoose.Promise = Promise;
var db = mongoose.connection;

// mongodb error
db.on('error', console.error.bind(console, 'connection error:'));

// mongodb connection open
db.once('open', () => {
  console.log(`Connected to Mongo at: ${new Date()}`)
});
// mongoose.connect(dbURI);

mongoose.connect(dbURI, {
  useMongoClient: true,
  promiseLibrary: global.Promise
});


mongoose.set('debug', false);

mongoose.connection.on('connected', function() {
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
  console.log(dbURI);
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
// static app;

module.exports = function(app) {

    var models = {
      collection: function(collectionName){
        return  mongoose.connection.collection(collectionName)
      },
        userSchemas: userSchemas,
        questionSchema:questionSchemas,
      // questionResponseSchema:questionResponseSchemas,
      questionCategorySchema:questionCategorySchema,
      newsSchema:newsSchema,
      exercisesSchema:exercisesSchema,
      registerSchema:registerSchema,
        categorySchema:categorySchema,
      executeQuery: function(query) {
        // return new Promise(function (resolve, reject) {
        //   query.exec(function(err, recordset) {
        //     if (err)
        //     {
        //       console.log("EROOOOOOOOOOOOOOOOOOOOOOOOR");
        //       console.log(err);
        //       resolve.resolve([]);
        //     }else{
        //       resolve(recordset);
        //     }
        //   });
        // });

        var deferred = q.defer();

        query.exec(function(err, recordset) {
          if (err)
          {
            console.log("EROOOOOOOOOOOOOOOOOOOOOOOOR");
            console.log(err);
            deferred.resolve([]);
          }else{
            // var aaa = recordset;
            // try {
            //   aaa = recordset.toObject();
            // }
            // catch (e)
            // {
            //   console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE " +e);
            // }
            deferred.resolve(recordset);
          }
        });
        return deferred.promise;
      },
        executeQuery1: function(query) {
            var deferred = q.defer();

            query.exec(function(err, recordset) {
                if (err)
                    {
                        console.log("EROOOOOOOOOOOOOOOOOOOOOOOOR");
                        console.log(err);
                        deferred.resolve([]);
                    }else{
                        deferred.resolve(recordset);
                    }
            });
            return deferred.promise;
        },
        result: function(ok, message, obj, res) {
            var response = {
                Success: ok,
                Message: message,
                Data: obj
            };
            //console.log("send response mongoQuery" + JSON.stringify(response));
            res.send(response);
        },
    };
    return models;
}
