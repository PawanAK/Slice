var express = require('express');
const { addExpense, viewExpense, viewGroupExpense, viewUserExpense, recentUserExpenses } = require('../controllers/expenseController');

const router = express.Router();

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/add', addExpense);
router.post('/view', viewExpense);
router.post('/group', viewGroupExpense);
router.post('/user', viewUserExpense);
router.post('/user/recent', recentUserExpenses);

module.exports = router;