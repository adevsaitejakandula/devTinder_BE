const express = require('express');
const userAuth = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router()

const SAFE_FIELDS = "firstName lastName age gender skills photoUrl about";
userRouter.get("/user/requests/recieved", userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", SAFE_FIELDS)
     // }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "skills", "photoUrl", "about"])
     res.json({
        "message": "connections fetched successfully",
        data: connections
     })
    } catch(err) {
        res.status(400).json({
            "message": "ERROR: " + err.message
        })
    }
})

userRouter.get('/user/connections', userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", SAFE_FIELDS).populate("toUserId", SAFE_FIELDS)
        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser?._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })
       console.log(connections, data, 'connections_log')
       res.json({
        "message": "Connections fetched successfully",
        data: data
       })
    } catch(err) {
        res.status(400).json({
            "message": "ERROR: " + err.message
        })
    }
})

userRouter.get("/feed", userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user;
        const page = (req.query?.page) || 1
        let limit = (req.query?.limit) || 10
        limit = limit > 50 ? 50 : limit;
        const skip = (page -1) * limit
        const connections = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId")
        let uniqueIds = new Set()
        connections.forEach((row) => {
            uniqueIds.add(row.fromUserId)
            uniqueIds.add(row.toUserId)
        })
        const users = await User.find({
            $and: [
                {
                    _id: {$nin: Array.from(uniqueIds)}
                },
                {
                    _id:{ $ne: loggedInUser._id}
                }
            ]
        }).select(SAFE_FIELDS).skip(skip).limit(limit)
        res.json({
            "message": "Feed fetched successfully",
            users
        })
    } catch(err) {
        res.status(400).json({
            "message": "ERROR: " + err.message
        })
    }
})

module.exports = userRouter;