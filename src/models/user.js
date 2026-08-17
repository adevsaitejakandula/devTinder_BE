const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    "firstName": {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100
    },
    "lastName": {
        type: String,
    },
    "email": {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(value + " is not valid email")
            }
        }
    },
    "password": {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("password should be min 8 characters, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1")
            }
        }
    },
    'age': {
        type: Number,
        min: 18
    },
    "phone": {
        type: String
    },
    "gender": {
        type: String,
        validate(value) {
            console.log(value, 'gender_value')
            if(!["male","female","other"].includes(value)) {
                throw new Error("Gender is not valid")
            }
        }
    },
    "photoUrl": {
        type: String,
        default: 'https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png',
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error(value + " is not valid url")
            }
        }
    },
    "skills": {
        type: [String]
    },
    "about": {
        type: String,
        default: 'This is the default about section'
    }
}, {
    timestamps: true
})


userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id},process.env.JWT_SECRET_KEY, {
        expiresIn: '1h'
    })
    return token;
}

userSchema.methods.isPasswordValidate = async function (passwordInputFromUser) {
    const user = this;
    const hashPassword = user.password
    const isPasswordValid = await bcrypt.compare(passwordInputFromUser, hashPassword)
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema)

module.exports = User