module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
    var questionResponseSchema = new mongoose.Schema({
        id: {
            type: String,
            index: true
        },
      qId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      },
      body:Schema.Types.Mixed,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    });

    var models = {
        QuestionResponse: mongoose.model('QuestionResponse', questionResponseSchema)
    };
    return models;
}

//http://doduck.com/node-js-mongodb-hello-world-example/
