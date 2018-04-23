module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
    var newsSchema = new mongoose.Schema({
        id: {
            type: String,
            index: true
        },
      title: String,
      titleClass:String,
      newsType: Number,
      p:Number,
      date:{
        Year:Number,
        date:Date
      },
      items:[Schema.Types.Mixed],
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    });

    var models = {
        News: mongoose.model('news', newsSchema)
    };
    return models;
}

//http://doduck.com/node-js-mongodb-hello-world-example/
