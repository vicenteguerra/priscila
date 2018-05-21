var express = require('express');
var router = express.Router();


let User = require('../controllers/API/UserController').User;
let Payment = require('../controllers/API/PaymentController').Payment;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Voice Payment' });
});

router.get('/user', User.index);
router.get('/user/:id', User.show);
router.post('/user', User.create);
router.delete('/user/:id', User.destroy);
router.patch('/user/:id', User.update);

router.get('/payment/:reference/:amount', Payment.creaCadenaPago)

module.exports = router;
