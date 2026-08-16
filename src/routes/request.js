const express = require('express');
const userAuth = require('../middleware/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

const requestRouter = express.Router()

requestRouter.post("/request/send/:status/:toUserId",userAuth, async(req,res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params?.toUserId;
        const status = req.params?.status;
        const allowedStatus = ["ignored", "interested"]
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status type" + status)
        }
        const toUser = await User.findById(toUserId)
        if (!toUser) {
            throw new Error('user not found')
        }
        const isConnectionRequestExisit = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })
        if (isConnectionRequestExisit) {
            throw new Error('Connection request already exist')
        }
        const newRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await newRequest.save()
        res.json({
            message:  `${req.user?.firstName} is ${status} ${toUser?.firstName} request` 
        })
    } catch (err) {
        res.status(400).json({
            message: "Error: " + err.message
        })
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) => {
    try {
        const {status, requestId} = req.params
        const loggedInUser = req.user;
        const allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid request status" + status)
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if (!connectionRequest) {
            throw new Error("Connection request not found")
        }
        connectionRequest.status = status
        const data = await connectionRequest.save()
        res.json({
            "message": "Coonection Accepted succssfully",
            data
        })
    } catch(err) {
        res.status(400).json({
            "message": 'ERROR: ' + err.message
        })
    }
})

module.exports = requestRouter