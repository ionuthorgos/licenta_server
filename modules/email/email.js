//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#set-up-our-node-application-(package-json)

var jsonfile = require('jsonfile')
const renderer = require("../renderer/renderer")();
const nodemailer = require('nodemailer');
const config = require('../../config/development');
// const sesTransport = require('nodemailer-ses-transport');
var logger = require("./../logger/logger.js")();

module.exports = function() {

    var models = {
        mainPath:'./templates/',
        transporter: null,
        emailCreateUser: function(obj, to) {
            logger.log("emailCreateUser" + JSON.stringify(obj));
            if (!obj.langId) {
                obj.langId = "ro";
            }
            var langId = obj.langId.toLowerCase();

            if (langId != "ro" && langId != "en") {
                langId = "ro";
            }

            var templatePath = this.mainPath + langId + "/createuser.html";
            obj.confirmation = config.appUIUrl + "/confirmemail?id=" + obj.reset;
            var htmlResult = renderer.render(templatePath, obj);

            var subject = jsonfile.readFileSync(this.mainPath + langId + "/subject.json");
            if (!to) {
                to = obj.email;
            }
            var data = {
                to: to,
                subject: subject.register,
                body: htmlResult
            };
            this.sendEmail(data);

        },
        emailfbUser: function(obj) {
            if (!obj.langId) {
                obj.langId = "ro";
            }
            var langId = obj.langId.toLowerCase();

            if (langId != "ro" && langId != "en") {
                langId = "ro";
            }


            logger.log(obj);
            var templatePath = this.mainPath + langId + "/newfbuser.html";
            obj.confirmation = config.appUIUrl + "/confirmemail?id=" + obj.reset;
            var htmlResult = renderer.render(templatePath, obj);

            var subject = jsonfile.readFileSync(this.mainPath + langId + "/subject.json");

            var data = {
                to: obj.email,
                subject: subject.newfbuser,
                body: htmlResult
            };
            this.sendEmail(data);
        },
        emailForgotPassword: function(obj, to) {
            if (!obj.langId) {
                obj.langId = "ro";
            }
            var langId = obj.langId.toLowerCase();

            if (langId != "ro" && langId != "en") {
                langId = "ro";
            }

            var templatePath = this.mainPath + langId + "/forgotpassword.html";
            obj.confirmation = config.appUIUrl + "/resetpassword?reset=" + obj.reset;
            var htmlResult = renderer.render(templatePath, obj);

            var subject = jsonfile.readFileSync(this.mainPath + langId + "/subject.json");

            var data = {
                to: to,
                subject: subject.forgotpass,
                body: htmlResult
            };
            this.sendEmail(data);

        },
        emailNewFileAdded: function(obj) {
            try {
                if (!obj.langId) {
                    obj.langId = "ro";
                }
                var langId = obj.langId.toLowerCase();

                if (langId != "ro" && langId != "en") {
                    langId = "ro";
                }

                var templatePath = this.mainPath + langId + "/newFile.html";
                //obj.confirmation = config.appUIUrl + "/#/resetpassword?reset=" + obj.reset;
                obj.url =  config.appUrl+"/"+obj.url;
                var htmlResult = renderer.render(templatePath, obj);

                var data = {
                    to: 'claudiu9379@yahoo.com',
                    subject: "new file",
                    body: htmlResult
                };
                this.sendEmail(data);
            } catch (e) {
                console.log(e);
            }

        },
        emailStartBuy: function(obj, to) {
            logger.log("emailStartBuy" + JSON.stringify(obj));
            if (!obj.langId) {
                obj.langId = "ro";
            }
            var langId = obj.langId.toLowerCase();

            if (langId != "ro" && langId != "en") {
                langId = "ro";
            }

            var templatePath = this.mainPath + langId + "/createuser.html";
            var htmlResult = renderer.render(templatePath, obj);

            var subject = jsonfile.readFileSync(this.mainPath + langId + "/subject.json");
            if (!to) {
                to = obj.email;
            }
            var data = {
                to: to,
                subject: subject.register,
                body: htmlResult
            };
            logger.log("emailStartBuy" + JSON.stringify(data));
            this.sendEmail(data);

        },

        sendEmail: function(obj) {

            // if (this.transporter == null) {
            //     this.transporter = nodemailer.createTransport(sesTransport({
            //         accessKeyId: config.aws.AWS_ACCESS_KEY_ID,
            //         secretAccessKey: config.aws.AWS_SECRET_ACCESS_KEY,
            //         rateLimit: 5,
            //         SeviceUrl: "email-smtp.eu-west-1.amazonaws.com",
            //         region: "eu-west-1"
            //     }));
            // }

          // create reusable transporter object using SMTP transport
          if (this.transporter == null) {
            const smtpConfig = {
              host:"mail.bestdeveloper.ro",
              port:26,
              secure:false,
              auth: {
                user: 'support@bestdeveloper.ro',
                pass: 'supportpassword'
              },
              tls:{
                rejectUnauthorized: false
              }
            };
           this.transporter = nodemailer.createTransport(smtpConfig);
          }

          let emailMessage = {
            from: 'support@bestdeveloper.ro',
            to: obj.to,
            subject: obj.subject,
            html: obj.body
          };
          if(obj.bcc){
            emailMessage.bcc = obj.bcc;
          }

          // console.log(obj);
            this.transporter.sendMail(emailMessage, function(err, data, res) {
                if (err) {
                    logger.log(err);
                }
            });


            // var mailOptions = {
            //  from: "claudiu", // sender address
            //  to: obj.to,
            //  subject: obj.subject, // Subject line
            //  html: obj.body
            // };
            // this.transporter.sendMail(mailOptions, function(error, info) {
            //  if (error) {
            //      return logger.log(error);
            //  }
            //  logger.log('Message sent: ' + info.response);
            // });
        }
    };
    return models;
}
