//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#set-up-our-node-application-(package-json)
const mongoQuery = require('../../utils/mongoQuery')();
const ObjectID = require("mongodb").ObjectID;

module.exports = function() {

  var models = {
    addUpdateCategory: async function(body) {
      const resp = mongoQuery.collection('category').insert(body);  //await ctx.app.people.insert(ctx.body);
      return resp;
    },

    updateCategory: async function(body) {
      const resp = mongoQuery.collection('category').update({
        _id: new ObjectID(body._id),
      }, {
        $set: {bbb:8998}
      })
      return resp;
    },



  };
  return models;
}
