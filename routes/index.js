var express = require('express');
let router = express.Router();
let Priscila = require('../controllers/Core/PriscilaController').Priscila;

let User = require('../controllers/API/UserController').User;
let Payment = require('../controllers/API/PaymentController').Payment;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Priscila' });
});

router.post('/message', Priscila.processMessage);

router.get('/user', User.index);
router.get('/user/:id', User.show);
router.post('/user', User.create);
router.delete('/user/:id', User.destroy);
router.patch('/user/:id', User.update);


module.exports = router;
