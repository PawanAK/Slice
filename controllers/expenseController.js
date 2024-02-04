const Group = require('../models/groupModel');
const Expense = require('../models/expenseModel');
const validator = require('../helper/validation');

const gorupDAO = require('./groupController');


exports.addExpense = async (req, res) => {
    try {
        let expense = req.body;
        let group = await Group.findOne({
            _id: expense.groupId
        })
        if (!group) {
            let err = new Error("Invalid Group Id")
            err.status = 400
            throw err
        }
        if (validator.notNull(expense.expenseName) &&
            validator.notNull(expense.expenseAmount) &&
            validator.notNull(expense.expenseOwner) &&
            validator.notNull(expense.expenseMembers) &&
            validator.notNull(expense.expenseDate)) {
            let ownerValidation = await validator.groupUserValidation(expense.expenseOwner, expense.groupId)
            if (!ownerValidation) {
                let err = new Error("Please provide a valid group owner")
                err.status = 400
                throw err
            }
            for (let user of expense.expenseMembers) {
                let memberValidation = await validator.groupUserValidation(user, expense.groupId)
                if (!memberValidation) {
                    let err = new Error("Please ensure the members exixt in the group")
                    err.status = 400
                    throw err
                }
            }
            expense.expensePerMember = expense.expenseAmount / expense.expenseMembers.length
            expense.expenseCurrency = group.groupCurrency
            let newExp = new Expense(expense)
            let newExpense = await Expense.create(newExp)

            //New expense is created now we need to update the split values present in the group 
            let update_response = await gorupDAO.addSplit(expense.groupId, expense.expenseAmount, expense.expenseOwner, expense.expenseMembers)

            res.status(200).json({
                status: "Success",
                message: "New expenses added",
                Id: newExpense._id,
                splitUpdateResponse: update_response
            })
        }
    } catch (err) {

        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

exports.viewExpense = async (req, res) => {
    try {
        let expense = await Expense.findOne({
            _id: req.body.id
        })
        if (expense.length == 0) {
            let err = new Error("No expense present for the Id")
            err.status = 400
            throw err
        }
        res.status(200).json({
            status: "Success",
            expense: expense
        })
    } catch (err) {

        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

exports.viewGroupExpense = async (req, res) => {
    try {
        let groupExpense = await Expense.find({
            groupId: req.body.id
        }).sort({
            expenseDate: -1 //to get the newest first 
        })
        if (groupExpense.length == 0) {
            let err = new Error("No expense present for the group")
            err.status = 400
            throw err
        }
        let totalAmount = 0
        for (let expense of groupExpense) {
            totalAmount += expense['expenseAmount']
        }
        res.status(200).json({
            status: "Success",
            expense: groupExpense,
            total: totalAmount
        })
    } catch (err) {

        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

exports.viewUserExpense = async (req, res) => {
    try {
        validator.notNull(req.body.user)
        let userExpense = await Expense.find({
            expenseMembers: req.body.user
        }).sort({
            expenseDate: -1 //to get the newest first 
        })
        if (userExpense.length == 0) {
            let err = new Error("No expense present for the user")
            err.status = 400
            throw err
        }
        let totalAmount = 0
        for (let expense of userExpense) {
            totalAmount += expense['expensePerMember']
        }
        res.status(200).json({
            status: "Success",
            expense: userExpense,
            total: totalAmount
        })

    } catch (err) {

        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

exports.recentUserExpenses = async (req, res) => {
    try {
        var recentExpense = await Expense.find({
            expenseMembers: req.body.user
        }).sort({
            $natural: -1 //to get the newest first 
        }).limit(5); //to get the top 5 
        if (recentExpense.length == 0) {
            var err = new Error("No expense present for the user")
            err.status = 400
            throw err
        }
        res.status(200).json({
            status: "Success",
            expense: recentExpense
        })
    } catch (err) {

        res.status(err.status || 500).json({
            message: err.message
        })
    }
}