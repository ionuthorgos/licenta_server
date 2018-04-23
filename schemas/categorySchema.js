module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
    var categorySchema = new mongoose.Schema({
        id: {
            type: String,
            index: true
        },
      date:Date,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        name:String,
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category'
        }
    });

    var models = {
      Category: mongoose.model('category', categorySchema)
    };
    return models;
}

//http://doduck.com/node-js-mongodb-hello-world-example/
