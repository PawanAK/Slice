const express = require('express');
const { loginUser, signupUser, viewUser, emailList, } = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/view', requireAuth, viewUser);
router.get('/emailList', requireAuth, emailList);

module.exports = router;