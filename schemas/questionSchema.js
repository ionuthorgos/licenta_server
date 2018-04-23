module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
    var questionSchema = new mongoose.Schema({
        id: {
            type: String,
            index: true
        },
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionCategory'
      },
      question: String,
      questionType: Number,
      answerCount: Number,
      answers: Array,
      timer:{
        enabled:Boolean,
        secStart:Number,
        countUp:Boolean,
        running:Boolean,
        seconds:Number,
        up:Boolean
      },
      testCasesStr:String,
      testCases:{list:[Schema.Types.Mixed]},
      code:String,
      answerType:Schema.Types.Mixed,
      guid:String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      userAnswers:[Schema.Types.Mixed]
    });

    var models = {
        Question: mongoose.model('Question', questionSchema)
    };
    return models;
}

//http://doduck.com/node-js-mongodb-hello-world-example/
