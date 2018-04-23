module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
    var registerSchema = new mongoose.Schema({
        id: {
            type: String,
            index: true
        },
      date:Date,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
    });

    var models = {
      Register: mongoose.model('register', registerSchema)
    };
    return models;
}

//http://doduck.com/node-js-mongodb-hello-world-example/
