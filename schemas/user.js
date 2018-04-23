module.exports = function(mongoose) {
    var userSchema = new mongoose.Schema({
        id: {
            type: String,
            index: true
        },
        nick: String,
        password: String,
        email: String,
        salt: String,
        unread:Number,
        webSite:String,
        avatar: {
            id:"",
            name: String,
            bucket: String,
            url:String
        },
        confirmed: Boolean,
        permission:Number,
        reset: String,
        address: String,
        genre:Number,
        birth:Date,
        phone:String,
        lld:Date,
        offset:Number,
        amount:{
            value:Number,
            blocked:Number
        },
        buletin:{
            url:String,
            status:Number,
            msg:String,
            expirationDate:Date
        },
      registered:Number,
      firstName:String,
      lastName:String,
      phone:String,
      name:String,
      userOrCompany:Number,
      allowLogo: Boolean,
      companyName:String,
      companyLogo:String,
        currency:[{name:String,address:String}],
        t:Number//owner, user normal


    });

    userSchema.index({
        loc: '2dsphere'
    });

    // declare seat covers here too
    //privacy:int, --//0 public, 1 private (just for me), 2 (shared with my friends), 4 (shared with a list of my friends), 8 (shared with a list of public persons)
    //country:[], --//0 all
    var models = {
        Users: mongoose.model('User', userSchema)
    };
    return models;
}

//http://doduck.com/node-js-mongodb-hello-world-example/
