const express = require('express')
const userAuth = require('../middleware/auth')
const {validateEditData} = require('../utils/validate')
const validator = require('validator')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const profileRouter = express.Router()

profileRouter.get('/profile/view',userAuth, async (req,res) => {
    try {
        const user = req.user;
        console.log(user,'user_log')
        res.json({
            user: user
        })
    } catch(error) {
        res.status(400).send("ERROR: " + error.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req,res) => {
    try {
        if (!validateEditData(req.body)) {
            throw new Error("Only FirstName, LastName, Skills, Age, Gender, About, Phone fileds are allowed to edit")
        }
        const loggedInUser = req.user;
        Object.keys(req.body)?.forEach((key) => loggedInUser[key] = req.body[key])
        await loggedInUser.save()
        res.json({
            message: `${loggedInUser.firstName}, Your profile updated successfully.`,
            user: loggedInUser
        })
    } catch(err) {
        res.status(400).json({
            "message": "ERROR: " + err.message
        })
    }
})

profileRouter.patch("/forgotPassword", userAuth, async (req,res) => {
    try {
        const {password} = req.body
        const loggedInUser = req.user;
        if (!validator.isStrongPassword) {
            throw new Error("PAssword must be min 8 char and atleast 1 uppercase char, 1 lowercase char, 1 number, 1 symbol")
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        loggedInUser.password = hashedPassword;
        await User.findByIdAndUpdate({_id: loggedInUser._id},loggedInUser)
        const token = await loggedInUser.getJWT()
        res.cookie("token", token)
        res.json({
            message:  `${loggedInUser.firstName}, your password updated successfully`,
            user: loggedInUser
        })
    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

module.exports = profileRouter