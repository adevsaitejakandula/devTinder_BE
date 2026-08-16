const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const { validateSignupData } = require('../utils/validate');
const authRouter = express.Router()
const User = require('../models/user')

authRouter.post('/signup', async (req,res) => {
    try {
        validateSignupData(req.body)
        const {firstName, lastName,email,password,gender,phone,photoUrl,age,skills,about} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age,
            about,
            skills,
            gender,
            phone,
            photoUrl
        })
        const user = await newUser.save()
        const token = await user.getJWT()
        res.cookie("token", token)
        res.json({
            "message": "user created successfully",
            data: user
        })
    } catch(error) {
        res.status(400).send("ERROR: " + error.message)
    }
})

authRouter.post('/login', async (req,res) => {
    try {
        const {email,password} = req.body;
        if (!validator.isEmail(email)) {
            throw new Error("Invalid credentials")
        }
        const user = await User.findOne({email: email})
        if(!user) {
            throw new Error('Invalid credentials')
        }
        const isPasswordValid = await user.isPasswordValidate(password)
        if (isPasswordValid) {
            const token = await user.getJWT()
            res.cookie("token", token)
            res.json({
                "message": "user loggedin successfully",
                data: user
            })
        } else {
            throw new Error("Invalid Credentials")
        }
    } catch(error) {
        res.status(400).json({
            message: "ERROR: " + error.message
        })
    }
})

authRouter.post("/logout", async (req,res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logout successfull!!")
})

module.exports = authRouter