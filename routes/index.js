var express = require('express');
const sendMail = require('../lib/sendBulkEmail');

var router = express.Router();

/* GET home page. */
router.post('/', function (req, res, next) {
  console.log(req.body)
  sendMail(req)
  res.status(200).send({
    message: "Processing"
  });
});

router.get('/ping', (req, res, next) =>{
  res.status(200).send('PONG');
});


module.exports = router;