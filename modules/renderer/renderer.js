//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#set-up-our-node-application-(package-json)

const swig = require('swig');
var logger = require("./../logger/logger.js")();
var fs = require('fs');
var Handlebars = require('handlebars');

module.exports = function() {

    var models = {
        render: function(templatePath, obj) {
          // obj = {
          //   authors: ['Paul', 'Jim', 'Jane']
          // };

          //var htmlResult = swig.renderFile(templatePath, obj);
          //var template  = swig.compileFile(templatePath);

          var contents = fs.readFileSync(templatePath, 'utf8');
          var template = Handlebars.compile(contents);
          htmlResult = template(obj);
          return htmlResult;
        }
    };
    return models;
}
