const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs")
const UserScheme = new Schema({
    username: {
        type: String,
        required: [true, 'Please provide username'],
        minLength: [6, 'No less than 6 character for username'],
        unique: [true, "User name was used before!"]
    },
    password: {
        type: String,
        required: [true, "Please provide password!"],
        minLength: [6, 'No less than 6 character for password']
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    avatar: {
        type: String,
        default: "Client.jpg",
    },

    address: {
        type: String,
        trim: true
    },

    dateOfBirth: {
        type: Date,
        default: Date.now(),
    },

    phoneNumber: {
        type: String,
        //required: [true, "Please provide phonenumber"]
    },
    faculty: {
        type: String,
    },
    school: {
        type: String,
    },
    studentCourse: {
        type: String,
    },
    GPA: {
        type: Number,
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    },
    latestAccess: {
        type: Date,
        default: Date.now()

    },
    ban: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: "user",
    }

})

UserScheme.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
UserScheme.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model('User', UserScheme);