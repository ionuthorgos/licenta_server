const newsService = require('../modules/news/newsService');
const securityService = require('../modules/security/security');

function getModule(name) {
  console.log(name);
  switch (name){
    case 'news':{
      return newsService;
      break;
    }
    case 'security':{
      return securityService();
      break;
    }
  }

};

module.exports.getModule = (name) => getModule(name);
