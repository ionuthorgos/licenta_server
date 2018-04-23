const mongoQuery = require('../../utils/mongoQuery')();
const ObjectID = require("mongodb").ObjectID;


class QuestionService {

  async add_edit(data, query = {}) {
    // console.log("YEEEEEEEEEEEEEEEEEEE");
    // console.log(data);

    var findCriteria = {};
    if (data._id) {
      findCriteria._id = ObjectID(data._id);
    } else {
      findCriteria._id = new ObjectID();
    }
    var setCriteria = {
      '$set': {
        categoryId:data.categoryId,
        question: data.question,
        questionType: data.questionType,
        answerCount: data.answerCount,
        answers: data.answers,
        timer: data.timer,
        testCasesStr: data.testCasesStr,
        testCases: data.testCases,
        code: data.code,
        answerType: data.answerType,
        guid: data.guid,
        userId: data.userId
      }
    }

    var dbQuestion = await mongoQuery.questionSchema.Question.update(findCriteria, setCriteria, {
      upsert: true
    });
    return dbQuestion;
  }

  async addEditCategory(data) {
  // console.log("YEEEEEEEEEEEEEEEEEEE");

  var findCriteria = {};
  if (data._id) {
    findCriteria._id = ObjectID(data._id);
  } else {
    findCriteria._id = new ObjectID();
  }
  var setCriteria = {
    '$set': {
      name: data.name,
      desc: data.desc,
      parentId: data.parentId,
      answers: data.answers,
      addedDate:new Date()
    }
  }

  var dbQuestionCategory = await mongoQuery.questionCategorySchema.QuestionCategory.update(findCriteria, setCriteria, {
    upsert: true
  });
  return dbQuestionCategory;
  // bulk.find({
  //   _id: new mongo.ObjectID(_id)
  // }).upsert().updateOne(
  //   body
  // );

  return;
  if (data._id) {
    data._id = ObjectID(data._id);

    await mongoQuery.collection('question').remove({ _id: data._id });
  }

  //const question = await  mongoQuery.collection('question').insert(data);
  const question = await aaa.save();
  return { _id: question.ops[0]._id };
}

  async getCategories(data, tokenObj) {
    //data.userId = tokenObj.id;
  const filterCriteria = data.filter || {};
  const doc = await mongoQuery.questionCategorySchema.QuestionCategory.find(filterCriteria);
    return doc;
}


  async storeAnswerForQuestion(data, tokenObj) {
    data.userId = tokenObj.id;
    const resp = await mongoQuery.questionSchema.Question.update(
    	{ _id: data.qid },
    	{ $push: { userAnswers: data } });

    // console.log(resp);
    return resp;



    // const doc = mongoQuery.collection('questionResponses');
    // const existentAnswer = await doc.findOne({
    //   userId: data.userId,
    //   qid: data.qid
    // });

    // if (existentAnswer) {
    //   return {
    //     ok: false
    //   }
    // }
    // const questionResponse = await doc.insert(data);
    // return { ok: true };
  }

  async getQuestion(data, tokenObj) {
  if(!data.userId) {
    data.userId = tokenObj.id;
  }

  if(data.filter._id)
  {
    data.filter._id = ObjectID(data.filter._id);
  }

    // console.log(data);
    const doc = mongoQuery.collection('questions');
    const question = await doc.findOne(data.filter,
    {categoryId:1,question:1,questionType:1,answerCount:1,answers:1,timer:1,testCasesStr:1,
      testCases:1,code:1,answerType:1,guid:1,userId:1,userAnswers:{$elemMatch: {userId: data.userId}}}
    );
  // console.log(question);
    return question;
  }




  async getAnswerForQuestion(data, tokenObj) {
    // console.log(data);
    data.userId = tokenObj.id;
    const doc = mongoQuery.collection('questionResponses');
    const existentAnswer = await doc.findOne({
      userId: data.userId,
      qid: data.qid
    });

    return existentAnswer.body;
  }



  async form(data, query = {}) {
    // console.log("YZZZZZZZZZZ");

    const question = await mongoQuery.collection('question').insert(data);
    // question._id = question.ops[0]._id;

    return { _id: question.ops[0]._id };
  }

  async getQuestions(obj, tokenObj) {
  debugger;
    // console.log(obj.pager);
  if(!obj.userId) {
    obj.userId = tokenObj.id;
  }
  if(!obj.userId)
  {
    throw "No user Id on getQuestions";
  }
    const filterCriteria = {};
  if(obj.filter)
  {
    if(obj.filter.categoryId)
    {
      filterCriteria.categoryId = ObjectID(obj.filter.categoryId);
    }
  }

  const fields = {categoryId:1,question:1,questionType:1,answerCount:1,answers:1,timer:1,testCasesStr:1,
    testCases:1,code:1,answerType:1,guid:1,userId:1,userAnswers:{$elemMatch: {userId: obj.userId}}};
    var filter = mongoQuery.questionSchema.Question
      .find(filterCriteria)
      .select(fields);


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
    const questions = await mongoQuery.executeQuery(filter);

    // console.log(questions);
    const count = await mongoQuery.collection('questions').count(filterCriteria);
    return {
      items: questions,
      count: count,
      pageNo: obj.pager ? obj.pager.pageNo + 1 : 0
    };
  }


  async checkAnswersForQuestion(data, tokenObj) {
  // console.log(data);
  // data.userId = tokenObj.id;
  // data.questionId

  let  question = await this.getQuestion(data,tokenObj);
  let newQuestion = this.checkAnswers(question);

  return newQuestion;
}

  async checkAnswersForCategory(data, tokenObj) {
  // console.log(data);
  // data.userId = tokenObj.id;
  // data.questionId
  const result = [];
  const questions = await this.getQuestions(data,tokenObj);
  for(var i=0;i<questions.items.length;i++)
  {
    const question = questions.items[i]._doc;
    const checkedQuestion =  this.checkAnswers(question);
    result.push(checkedQuestion);
  }
  return result;
}
  isUndefined(obj)
  {
    return obj === undefined;
  }

  checkAnswers(question) {

    question.showAnswers = true;
    if(question.userAnswers && question.userAnswers.length)
    {
      question.userAnswer = question.userAnswers[0].body;
    }

    const answerTypeObj = question.answerType;


    switch (question.questionType) {
      case QuestionType.Text:
      case QuestionType.Image: {
        question.answers.forEach(it=> {delete it.correctAswered; it.class = '';});

        switch (question.answerType.type) {
          case AnswerType.SingleAnswer: {
            let selectedOption = question.rdValue;
            if (this.isUndefined(selectedOption) && question.userAnswer) {
              selectedOption = question.userAnswer.rdValue;
            }
            if (this.isUndefined(selectedOption)) {
              break;
            }
            const selectedAnswer = question.answers.find(it => it.index === selectedOption);
            if (this.isUndefined(question.rdValue)) {
              question.rdValue = selectedOption;
            }
            if (answerTypeObj.isCorrect < 0) {
              break;
            }
            const correctAnswer = question.answers[answerTypeObj.isCorrect];
            if(correctAnswer) {
              correctAnswer.isCorrect = true;
              correctAnswer.class += " correct fa fa-check";
            }
            question.correctAswered = selectedOption == answerTypeObj.isCorrect;

            selectedAnswer.correctAswered = answerTypeObj.isCorrect == selectedAnswer.index;
            if(selectedAnswer.correctAswered)
            {
              selectedAnswer.class += " good";
            }else{
              selectedAnswer.class += " notgood";
            }
            break;
          }

          case AnswerType.MultipleAnswers: {
            let correctAswered = true;
            for (var i = 0; i < question.answers.length; i++) {

              let ans = question.answers[i];
              if (question.userAnswer) {
                const checkedAnswers = question.userAnswer.checkedAnswers;
                const checked = checkedAnswers.find(it=>it.index === ans.index);
                ans.rdValue = checked != null;
              }

              // if (!this.isUndefined(ans.isCorrect)) {
                if (ans.isCorrect) {
                  ans.class += " correct fa fa-check";
                  if(ans.rdValue)
                  {
                    ans.class += " good";
                  }else{
                    //ans.class += " notgood";
                  }
                  correctAswered = false;

                }
                if(ans.rdValue)
                {
                  if (!ans.isCorrect) {
                    ans.class += " notgood";
                    correctAswered = false;
                  }else{
                    ans.class += " plm";
                  }
                }

                // if (ans.isCorrect && !ans.rdValue) {
                //   correctAswered = false;
                //   ans.class += " notgood";
                // }


              // }

            }

            question.correctAswered = correctAswered;

            break;
          }
        }

        break;
      }
      case QuestionType.Code: {
        break;
      }
    }
    for (var i = 0; i < question.answers.length; i++) {
      let ans = question.answers[i];

      switch (question.answerType.type) {
        case AnswerType.SingleAnswer: {
          const selectedOption = answerTypeObj.rdValue;
          question.correctAswered = selectedOption == answerTypeObj.isCorrect;

          break;
        }
        case AnswerType.MultipleAnswers: {
          break;
        }
      }
    }

    question.isDisabled = true;

    return question;
  }


}

module.exports = new QuestionService();
