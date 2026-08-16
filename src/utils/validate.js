const validator = require('validator')
const validateSignupData = (data) => {
    const {firstName = '',lastName = '',email = '',password = ''} = data
    if(!firstName || !lastName) {
        throw new Error('firstName & lastName are manidatory')
    } else if (!validator.isEmail(email)) {
        throw new Error('please enter valid email')
    } else if (!validator.isStrongPassword(password)) {
        throw new Error('password should contain min 8 char, min 1 uppercase, min 1 lowercase, min 1 number, min 1 symbol')
    }
}

const validateEditData = (data) => {
    const allowedEditFields = ["firstName", "lastName", "skills", "age", "gender","about", "photoUrl", "phone"]

    const isAllowedEdit = Object.keys(data)?.every((key) => allowedEditFields.includes(key))
    return isAllowedEdit;
}

module.exports = {validateSignupData, validateEditData}