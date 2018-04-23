const router = require('koa-router')();
// const authMiddleware = require('../shared/auth/auth.middleware').errorHandler();
const mongoQuery = require('../utils/mongoQuery')();
const jwtMiddleware = require("../jwt/jwt");
const ObjectID = require("mongodb").ObjectID;

const categoryHelper = require("../modules/categories/categoryHelper")

router
  .prefix('/api/category')
  .use(jwtMiddleware.mainPrivateMiddleware())

    .post("/add", async function (ctx) {
  console.log("intra in addd");

  const body = ctx.request.body;

  var entity = new mongoQuery.categorySchema.Category();
  entity.name = body.name;

  var rez =  await entity.save();

  // var entity = await mongoQuery.collection('category').insert(body);

  return rez;
  })

.post("/insertoropdate", async function (ctx) {
  console.log("intra in addd");

  const body = ctx.request.body;
  return await categoryHelper.add_edit(body);

})


.post("/generic", async function (ctx) {
  const body = ctx.request.body;
  console.log("generic");
  console.log(body);

  const data = body.data;

  const method = body.proxy.method;
  const service = categoryHelper;


  const resp = await service[method](data, body.tokenObj);
  return resp;
})

  .post("/", async function (ctx) {
  // console.log("category");

  // const body = ctx.request.body;
  //
  // const resp = categoryService.addUpdateCategory(body);  //await ctx.app.people.insert(ctx.body);
  // return resp;

  const body = ctx.request.body;
  // console.log(body);

  const data = body.data;
  const method = body.proxy.method;
  const module = categoryService;


  const resp = await module[method](data, body.tokenObj);
  return resp;
})

module.exports = router;
