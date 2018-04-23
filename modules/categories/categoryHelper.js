const mongoQuery = require('../../utils/mongoQuery')();
const ObjectID = require("mongodb").ObjectID

class CategoryHelper {

    async add_edit(data, tokenObj) {

    var findCriteria = {};
    findCriteria.id = data.id;
    // if (data._id) {
    //     findCriteria._id = ObjectID(data._id);
    // }else {
    //     findCriteria._id = new ObjectID();
    // }

    var setCriteria = {
        '$set': {
            name:data.name,
            id:data.id,
            userId: tokenObj.id
        }
    }

    var entity= await mongoQuery.categorySchema.Category.update(findCriteria, setCriteria, {
        upsert: true
    });
    return entity;

}

    async get(data, tokenObj) {


    console.log(data);
    console.log(tokenObj);
    var findCriteria = {
        userId: new ObjectID(tokenObj.id)
    };

    var entity= await mongoQuery.categorySchema.Category.find(findCriteria);

    console.log(entity);
    return entity;

}
}

module.exports = new CategoryHelper();