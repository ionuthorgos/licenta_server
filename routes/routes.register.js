const router = require('koa-router')();
const securityModule = require('../modules/security/security')();
const parse = require('co-body');
const fs = require('fs-extra');
const koabusBoy = require('co-busboy');
const cmd = require('node-cmd');
const testPipeline = require('pipeline-test-node');
const jasmineNode = require('jasmine-node');
var newman = require('newman');
const mongoQuery = require('../utils/mongoQuery')();
const jwtMiddleware = require("../jwt/jwt");
var Mocha = require('mocha'),
    path = require('path');

const uuidv4 = require('uuid/v4');
const registerService = require('../modules/register/registerService');

const config = require('../config/development');


router
  .prefix('/api/register')
  .use(jwtMiddleware.mainPrivateMiddleware())
  .post("/", async function (ctx) {
   console.log("ruta news");

    const body = ctx.request.body;
    // console.log(body);
    const data = body.data;
    const method = body.proxy.method;


    const resp = await registerService[method](data, body.tokenObj);
    return resp;

    // ctx.body = responseWrapper.success(resp);
  })







module.exports = router;
