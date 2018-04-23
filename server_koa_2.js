const koa = require('koa');
const http = require('http');
const https = require('https');
var forceSSL = require('koa-force-ssl');
const lcPublicRoutes = require('./routes/public.routes');
const routesQuestion = require('./routes/routes.question');
const routesReports = require('./routes/routes.reports');
const routesCategory = require('./routes/routes.category');
const routesNews = require('./routes/routes.news');
const routesRegister = require('./routes/routes.register');
const routesPrivate = require('./routes/routes.private');
const lcRouter = require('koa-router')();
const routesdelete = require('./routes/routes.delete');

const responseWrapper = require('./utils/responseWrapper')();
// const errorCatcher = require('./shared/error-handling/errorCatcher');

const parse = require('co-body');
const koaBody = require('koa-body');
const co = require('co');
const fs = require('fs');
const colors = require('colors');
const utils = require('./shared/utils');
const path = require('path');
const send = require('koa-send');
const asyncBusboy = require('async-busboy');

const logger = require('koa-logger');
const ObjectID = require("mongodb").ObjectID;
const BodyParser = require("koa-bodyparser");
const staticServe = require('koa-static');
const  config =  require('./config/development');
const serve = require('koa2-static-middleware');
const cors = require('@koa/cors');

const app = new koa();
const mongoQuery = require('./utils/mongoQuery')(app);


app.use(cors());
app.use(BodyParser());
app.use(cors());

// app.use('/api',async (ctx, next) => {
//   let response = null;
//   try {
//     response = await next(); // next is now a function
//     ctx.body = responseWrapper.success(response);
//   } catch (err) {
//     ctx.body = responseWrapper.failure(err);
//   }
// })



lcRouter.use(lcPublicRoutes.routes());
lcRouter.use(routesQuestion.routes());
lcRouter.use(routesReports.routes());
lcRouter.use(routesCategory.routes());
lcRouter.use(routesNews.routes());
lcRouter.use(routesRegister.routes());
lcRouter.use(routesPrivate.routes());
lcRouter.use(routesdelete.routes());


app.use(lcRouter.routes()).use(lcRouter.allowedMethods());

lcRouter.get('/', serve('../dist', { index: 'index.html' }));

lcRouter.get("/uploads/:id", async function (ctx) {
  await send(ctx, ctx.path);
});


console.log(lcRouter.stack.map(i => i.path));

const port =  6002;
const server = app.listen(port).on("error", err => {
    console.error(err);
});
// console.log("socket");

const ioSocket = require("./modules/socket/ioSocket")();
ioSocket.connect(server);



module.exports = server;
