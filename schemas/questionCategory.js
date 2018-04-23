module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
    var questionCategorySchema = new mongoose.Schema({
        id: {
            type: String,
            index: true
        },
      name: String,
      desc:String,
      parentId:String,
      addedDate:Date
    });

    var models = {
        QuestionCategory: mongoose.model('QuestionCategory', questionCategorySchema)
    };
    return models;
}

//http://doduck.com/node-js-mongodb-hello-world-example/
