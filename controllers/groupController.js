const Group = require('../models/groupModel');
const Settlement = require('../models/settlementModel');
const validator = require('validator');
const splitCalculator = require('../helper/split');


exports.createGroup = async (req, res) => {
    try {
        let newGroup = new Group(req.body)
        //Performing validation on the input
        if (validator.notNull(newGroup.groupName) &&
            validator.currencyValidation(newGroup.groupCurrency)) {

            /*
            Split Json is used to store the user split value (how much a person owes)
            When the Group is created all members are assigned the split value as 0    
            */
            let splitJson = {}

            for (let user of newGroup.groupMembers) {
                //Validating the group Members exist in the DB 
                let memberCheck = await validator.userValidation(user)
                if (!memberCheck) {
                    let err = new Error('Invalid member id')
                    err.status = 400
                    throw err
                }

                //Adding user to the split Json and init with 0 
                splitJson[user] = 0
            }

            /*
            Split Json will now contain an json with user email as the key and the split amount (currently 0) as the value
            We now store this splitJson object to the newGroup model so it can be stored to DB directly
            */
            newGroup.split = splitJson

            //Validating the group Owner exist in the DB 
            let ownerCheck = await validator.userValidation(newGroup.groupOwner)
            if (!ownerCheck) {
                let err = new Error('Invalid owner id')
                err.status = 400
                throw err
            }

            let id = await Group.create(newGroup)
            res.status(200).json({
                status: "Success",
                message: "Group Creation Success",
                Id: id._id
            })
        }
    } catch (err) {

        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

exports.viewGroup = async (req, res) => {
    try {
        const group = await Group.findOne({
            _id: req.body.id
        })
        if (!group || req.body.id == null) {
            let err = new Error('Invalid Group Id')
            err.status = 400
            throw err
        }
        res.status(200).json({
            status: "Success",
            group: group,
        })
    } catch (err) {

        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

exports.findUserGroup = async (req, res) => {
    try {
        const user = await User.findOne({
            emailId: req.body.emailId
        })
        if (!user) {
            let err = new Error("User Id not found !")
            err.status = 400
            throw err
        }
        const groups = await Group.find({
            groupMembers: req.body.emailId
        }).sort({
            $natural: -1 //to get the newest first 
        })
        res.status(200).json({
            status: "Success",
            groups: groups
        })
    } catch (err) {

        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

exports.makeSettlement = async (req, res) => {
    try {
        let reqBody = new Settlement(req.body)
        validator.notNull(reqBody.groupId)
        validator.notNull(reqBody.settleTo)
        validator.notNull(reqBody.settleFrom)
        validator.notNull(reqBody.settleAmount)
        validator.notNull(reqBody.settleDate)
        const group = await Group.findOne({
            _id: req.body.groupId
        })
        if (!group) {
            let err = new Error("Invalid Group Id")
            err.status = 400
            throw err
        }

        group.split[0][req.body.settleFrom] += req.body.settleAmount
        group.split[0][req.body.settleTo] -= req.body.settleAmount

        let id = await Settlement.create(reqBody)
        let update_response = await Group.updateOne({ _id: group._id }, { $set: { split: group.split } })


        res.status(200).json({
            message: "Settlement successfully!",
            status: "Success",
            update: update_response,
            response: id
        })
    } catch (err) {

        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

exports.addSplit = async (groupId, expenseAmount, expenseOwner, expenseMembers) => {
    let group = await Group.findOne({
        _id: groupId
    })
    group.groupTotal += expenseAmount
    group.split[0][expenseOwner] += expenseAmount
    expensePerPerson = expenseAmount / expenseMembers.length
    expensePerPerson = Math.round((expensePerPerson + Number.EPSILON) * 100) / 100;
    //Updating the split values per user 
    for (let user of expenseMembers) {
        group.split[0][user] -= expensePerPerson
    }

    //Nullifying split - check if the group balance is zero else added the diff to owner 
    let bal = 0
    for (val of Object.entries(group.split[0])) {
        bal += val[1]
    }
    group.split[0][expenseOwner] -= bal
    group.split[0][expenseOwner] = Math.round((group.split[0][expenseOwner] + Number.EPSILON) * 100) / 100;
    //Updating back the split values to the gorup 
    return await Group.updateOne({
        _id: groupId
    }, group)
}

exports.groupBalanceSheet = async (req, res) => {
    try {
        const group = await Group.findOne({
            _id: req.body.id
        })
        if (!group) {
            let err = new Error("Invalid Group Id")
            err.status = 400
            throw err
        }
        res.status(200).json({
            status: "Success",
            data: splitCalculator(group.split[0])
        })
    } catch (err) {

        res.status(err.status || 500).json({
            message: err.message
        })
    }
}