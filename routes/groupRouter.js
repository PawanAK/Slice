var express = require('express');
const { createGroup, viewGroup, findUserGroup, groupBalanceSheet, makeSettlement } = require('../controllers/groupController');

const router = express.Router();

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.post('/add', createGroup);
router.get('/view', viewGroup);
router.get('/user', findUserGroup);
router.get('/settlement', groupBalanceSheet);
router.post('/makeSettlement', makeSettlement);

module.exports = router;