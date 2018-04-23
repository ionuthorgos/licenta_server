const mongoQuery = require('../../utils/mongoQuery')();
const ObjectID = require("mongodb").ObjectID;
const coreUtils = require('../../utils/core.utils')();
const securityService = require('../security/security')();
const courseRegisterReport = require('../reports/courseregister/courseregister')();

class RegisterService {

  async register(data, tokenObj) {

  data.userId = tokenObj.id;

  await mongoQuery.collection('register').update(
    { userId: data.userId },
    { $set:
      {
        date:new Date()
      }
    },{upsert:1});

  const resp = await securityService.registerToCourse(data);
  // console.log(resp);

  await courseRegisterReport.createReport({},tokenObj);

  return resp;
}


}

module.exports = new RegisterService();
