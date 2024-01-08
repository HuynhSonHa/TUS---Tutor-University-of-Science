const User = require("../models/User");
const { body } = require('express-validator');

const signinValidator = [
    body('username', 'Username must not be empty').notEmpty(),
    body('password', 'Password must not be empty').notEmpty(),
    body('username', 'Username must be at least 6 characters long').isLength({ min: 6 }),
    body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
];
const signupValidator = [
    body("email").trim()
        .notEmpty().withMessage("Email must not be empty")
        .isEmail().withMessage("Email is invalid")
        .escape()
        .custom(async value => {
          
            const foundedUser = await User.findOne({ email: value });
            if (!foundedUser) {
                return true;
            }
            else {
                throw new Error("Email is already registered");
            }
        }),
    body("username")
        .notEmpty().withMessage("Username must not be empty")
        .isLength({ min: 6 }).withMessage('Username must be at least 6 characters')
        .escape()
        .custom(async value => {
            const foundedUser = await User.findOne({ username: value });
            if (!foundedUser) {
                return true;
            }
            else {
                throw new Error("User is already registered");
            }
        }),
    body("password")
        .notEmpty().withMessage("Password must not be empty")
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .isStrongPassword().withMessage('Password is not strong enough')
        .escape(),

    body("passwordConfirmation")
        .notEmpty().withMessage("Confirm password must not be empty")
        .escape()
        .custom((value, { req }) => {
            console.log(value, req.body.password)
        if (value !== req.body.password) {
           
            throw new Error("Password not match");
        }
        return true;
    })
];
const forgetValidator = [
    body("email").trim()
        .notEmpty().withMessage("Email must not be empty")
        .isEmail().withMessage("Email is invalid")
        .escape()
];
const resetValidator = [
    body("password")
        .notEmpty().withMessage("Password must not be empty")
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .isStrongPassword().withMessage('Password is not strong enough')
        .escape(),

    body("password2")
        .notEmpty().withMessage("Confirm password must not be empty")
        .escape()
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
        }
        return true;
    })
];
const updateValidator = [
    body("oldPassword") 
        .notEmpty().withMessage("Old password must not be empty")
        .escape()
        .custom((value, { req }) => {
            const user = req.user;
            if (!user.validPassword(value)) {
                throw new Error("Old password is incorrect");
            }
            return true;
        }),
    body("newPassword")
        .notEmpty().withMessage("Password must not be empty")
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .isStrongPassword().withMessage('Password is not strong enough')
        .escape(),

    body("confirmPassword")
        .notEmpty().withMessage("Confirm password must not be empty")
        .escape()
        .custom((value, { req }) => {
          
        if (value !== req.body.newPassword) {
            throw new Error("Password confirmation does not match password");
        }
        return true;
    })
];
module.exports = {
    signinValidator,
    signupValidator,
    forgetValidator,
    resetValidator,
    updateValidator,
}