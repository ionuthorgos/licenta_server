module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
    var exerciseSchema = new mongoose.Schema({
        id: {
            type: String,
            index: true
        },
      date:Date,
      items:[{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        resp:Schema.Types.Mixed
      }]
    });

    var models = {
      Exercises: mongoose.model('exercises', exerciseSchema)
    };
    return models;
}

//http://doduck.com/node-js-mongodb-hello-world-example/
