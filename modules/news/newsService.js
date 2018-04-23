const mongoQuery = require('../../utils/mongoQuery')();
const ObjectID = require("mongodb").ObjectID;
const coreUtils = require('../../utils/core.utils')();

class NewsService {

  async add_edit(data, query = {}) {

  // console.log(data);
  var findCriteria = {};
  if (data._id) {
    findCriteria._id = ObjectID(data._id);
  } else {
    findCriteria._id = new ObjectID();
  }
  // const newsData = data.date? new Date(data.date) : new Date();
  // const date = coreUtils.toDateTimeInfo(newsData);
  //  data.date.mili = coreUtils.toDateTimeInfo(data);
  // date.date = date.date.toISOString();

  var setCriteria = {
    '$set': {
      // categoryId:data.categoryId,
      title: data.title,
      titleClass:data.titleClass,
      newsType: data.newsType,
      date: data.date,
      items: data.items,
      timer: data.timer,
      userId: data.userId,
      parent: data.parent,
      p:data.p
    }
  }

  var dbNews = await mongoQuery.collection('news').update(findCriteria, setCriteria, {
    upsert: true
  });

  return dbNews;
}

  async addItemForNews(data, tokenObj) {
  data.userId = tokenObj.id;
  const resp = await mongoQuery.collection('news').update(
    { _id: data._id },
    { $push: { items: data } });

  // console.log(resp);
  return resp;
}

  async getNews(data, tokenObj) {

  const filterCriteria = {};
  if(data.filter)
  {
    filterCriteria.newsType = {$eq:data.filter.newsType};
    if(data.filter.date)
    {
      // const filterDate = new Date(data.filter.date);
      // const isoDate = new Date(filterDate.toISOString());

      filterCriteria["date.jsdate"]= { $lte: data.filter.date};
      // filterCriteria["date.mili"]= { $lte: data.filter.mili};
    }

  }
  // data.userId = tokenObj.id;
  const query = mongoQuery.newsSchema.News
  //const query = mongoQuery.collection('news')
    .findOne(filterCriteria).sort({ "date.jsdate":-1 });//
  // .populate('title');

  const resp = await query; //mongoQuery.executeQuery(query);

  console.log(resp);
  return resp;
}

  async getAllNews(data, tokenObj) {

  const filterCriteria = {};
  if(data.filter)
  {
    filterCriteria.newsType = {$eq:data.filter.newsType};
    if(data.filter.date)
    {
      // const filterDate = new Date(data.filter.date);
      // const isoDate = new Date(filterDate.toISOString());

      //filterCriteria["date.jsdate"]= { $lte: data.filter.date};
      // filterCriteria["date.mili"]= { $lte: data.filter.mili};
    }

  }
  // data.userId = tokenObj.id;
  const query = mongoQuery.newsSchema.News
  //const query = mongoQuery.collection('news')
    .find(filterCriteria).sort({ p:1 });//
  // .populate('title');

  const resp = await query; //mongoQuery.executeQuery(query);

  console.log(resp);
  return resp;
}


  async solveExercise(data, tokenObj) {
  data.userId = tokenObj.id;
  data.date = new Date();

  const updateCriteria = {
    'items.resp': data.resp,
    date:new Date()
  };

  const resp = await mongoQuery.collection('exercises').update(
    {
      problemId: data._id,
      'items.userId': tokenObj.id
    },
    {
      $set:  updateCriteria
    },
    {
      upsert:true
    });

  console.log(resp);
  return resp;
}

  async getSolvedUsersCount(data, tokenObj) {
  data.userId = tokenObj.id;
  data.date = new Date();

  const updateCriteria = {
    'items.resp': data.resp
  };

  const resp = await mongoQuery.collection('exercises').count(
    {
      problemId: data._id
    });

  console.log(resp);
  return resp;
}

  async getSolvedSolutionForAUser(data, tokenObj) {
  data.userId = tokenObj.id;
  data.date = new Date();

  const updateCriteria = {
    'items.resp': data.resp
  };

  const resp = await mongoQuery.collection('exercises').find(
    {
      problemId: data._id,
      'items.userId': data.userId
    });

  console.log(resp);
  return resp;
}

  async getPagedSolutionsForAExercise(obj, tokenObj) {
  const filterCriteria = {
    problemId: obj.filter.problemId,
  };


  const fields = {problemId:1,'userId.email':1};
  var filter = mongoQuery.exercisesSchema.Exercises
    .find(filterCriteria)
    .populate('items.userId', 'email')
    // .select(fields);


  if (obj.pager) {
    obj.pager.itemsOnPage = parseInt(obj.pager.itemsOnPage);
    obj.pager.pageNo--;
    filter = filter.limit(obj.pager.itemsOnPage)
      .skip(obj.pager.itemsOnPage * obj.pager.pageNo)
    // query = query.sort({
    //   dateAdded: -1
    // });
  }
  // filter = filter.toArray();
  const solvedQuestions = await mongoQuery.executeQuery(filter);

  console.log(JSON.stringify(solvedQuestions));
  const count = await mongoQuery.collection('exercises').count(filterCriteria);
  return {
    items: solvedQuestions,
    count: count,
    pageNo: obj.pager ? obj.pager.pageNo + 1 : 0
  };
}

}

module.exports = new NewsService();
