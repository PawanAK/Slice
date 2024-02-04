const User = require('../models/user')
const Expense = require('../models/expense')
const Group = require('../models/group')
const Settlement = require('../models/settlement')

const logger = require('./logger')

exports.notNull = (value) => {
    if (value)
        return true
    else {
        let err = new Error("Please input the required field")
        err.status = 400
        throw err
    }
}

exports.emailValidation = (email) => {
    if (email && email.includes("@") && email.includes(".com"))
        return true
    else {
        let err = new Error("Email validation fail!!")
        err.status = 400
        throw err
    }
}

exports.passwordValidation = (pass) => {

    if (pass && pass.length >= 8) {
        return true
    }
    let err = new Error("Password validation fail!!")
    err.status = 400
    throw err
}



exports.userValidation = async (email) => {
    let user = await User.findOne({
        emailId: email
    })
    if (!user)
        return false
    else
        return true
}

exports.groupUserValidation = async (email, groupId) => {
    let groupMembers = await Group.findOne({
        _id: groupId
    }, {
        groupMembers: 1,
        _id: 0
    })
    groupMembers = groupMembers['groupMembers']
    if (groupMembers.includes(email))
        return true
    else {

        return false
    }
}