const express = require('express');
const router = express.Router();
const co = require('co');

const code = require('../modules/expression/code');
/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});


router.post('/funca', async(req, res) => {
  // console.log(req.body);
  const body = req.body;
  const response = await code.executeAsync(body.code);
  //res.send(response);

  // console.log(response);
  res.json(response);
});



router.post('/funcg', (req, res) => {
  // console.log(req.body);
  const body = req.body;

  co(function*() {
    var result = yield code.executeGenerator(body.code);
    res.json(result);
  }).then(function(value) {
    console.log(value); // value equals result
  }, function(err) {
    console.error(err.stack); // err equals result
  });
});

router.post('/funcp', async(req, res) => {
    console.log('ssss' + req.body);
    const body = req.body;
    const response = await code.executeWithPromise(body.code);
    //res.send(response);

    console.log(response);
    res.json(response);
  });


module.exports = router;
