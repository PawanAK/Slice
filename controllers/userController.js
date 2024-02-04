
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/userModel');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// login a user
const loginUser = async (req, res) => {
    const { emailId, password } = req.body;

    try {
        const user = await User.findOne({
            emailId: emailId
        });

        if (!user) {
            let err = new Error("Invalid email Id or Password!");
            err.status = 401;
            throw err;
        }

        // validating password using bcrypt
        const validCred = await bcrypt.compare(password, user.password);

        if (!validCred) {
            let err = new Error("Invalid email Id or Password* !");
            err.status = 401;
            throw err;
        } else {
            const accessToken = createToken(user.id);

            res.status(200).json({
                status: "Success",
                message: "User Login Success",
                userId: user.id,
                emailId: user.emailId,
                firstName: user.firstName,
                lastName: user.lastName,
                accessToken
            });
        }
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message
        });
    }
};

// signup a user
const signupUser = async (req, res) => {
    const { emailId, password } = req.body;

    try {
        // Checking email Id exist in DB
        const user = await User.findOne({
            emailId: emailId
        });

        // If email ID present in the database throws an error and returns a message
        if (user) {
            const err = new Error("Email Id already present please login!");
            err.status = 400;
            throw err;
        } else {
            // Accepts the inputs and creates a user model from req.body
            let newUser = new User(req.body);

            // Performing validations
            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(newUser.password, salt);

            // storing user details in DB
            let id = await User.create(newUser);

            res.status(200).json({
                status: "Success",
                message: "User Registration Success",
                userId: id.id
            });
        }
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message
        });
    }
};

const viewUser = async (req, res) => {
    try {
        //check if the login user is same as the requested user 
        apiAuth.validateUser(req.user, req.body.emailId)
        const user = await User.findOne({
            emailId: req.body.emailId
        }, {
            password: 0
        })
        if (!user) {
            let err = new Error("User does not exist!")
            err.status = 400
            throw err
        }
        res.status(200).json({
            status: "Success",
            user: user
        })
    } catch (err) {

        res.status(err.status || 500).json({
            message: err.message
        })
    }
}

const emailList = async (req, res) => {
    try {
        //check if the login user is same as the requested user 
        const userEmails = await User.find({
        }, {
            emailId: 1,
            _id: 0
        })
        if (!userEmails) {
            let err = new Error("User does not exist!")
            err.status = 400
            throw err
        }
        let emailList = []
        for (let email of userEmails) {
            emailList.push(email.emailId)
        }
        res.status(200).json({
            status: "Success",
            user: emailList
        })
    } catch (err) {

        res.status(err.status || 500).json({
            message: err.message
        })
    }
}





module.exports = { signupUser, loginUser, viewUser, emailList };
