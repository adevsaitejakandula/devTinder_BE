// const express = require('express')

// const app = express()

// app.use('/get', (req,res) => {
//     res.send("Hello world!")
// })

// app.get("/user", (req,res) => {
//     console.log(req.query)
//     res.send(`we have recieved name: ${req.query.name} & id: ${req.query.id}`)
// }) 

// app.get("/user" , (req,res) => {
//     res.send({
//         "firstname": "sai",
//         "lastname": "teja"
//     })
// })

// app.get("/user/:id/:name", (req,res) => {
//     console.log(req.params)
//     res.send(`we have recieved name: ${req.params.name} & id: ${req.params.id}`)
// })

// app.post("/user", (req,res) => {
//     console.log("Saved Data to data base")
//     res.send("Data Successfully saved to Data base")
// })

// app.delete("/user", (req,res) => {
//     console.log("deleted user successfully")
//     res.send("user Deleted successfully")
// })

// app.listen(2326, () => {
//     console.log("Server is listening successfully on 2326")
// })

// const express = require("express");
// const bcrypt = require('bcrypt')
// const validator = require('validator')
// const { connectDB } = require("./config/database.js");
// const User = require("./models/user.js");
// const {validateSignupData} = require('./utils/validate.js')
// const app = express();

// app.use(express.json())
// connectDB()
//   .then(() => {
//     console.log("Database connection established successfully");
//     app.listen(2326, () => {
//       console.log("Server is listening on port 2326");
//     });
//   })
//   .catch((err) => {
//     console.log("Database connection failed");
//   });

// app.post("/signup", async (req, res) => {
//     console.log(req.body)
//   try {
//     validateSignupData(req.body)
//     const {firstName = '', lastName = '', email='',password='',gender='',photoUrl='' , about='',age=''} = req.body
//     const hashedPassword = await bcrypt.hash(password,10)
//     const newUser = new User({
//         firstName,lastName,email,password: hashedPassword,photoUrl,gender,age,about
//     });
//    await newUser.save()
//     res.send('User Added successfully')
//   } catch (err) {
//     res.status(400).send("Failed to add user" + err.message);
//   }
// });

// app.post("/login", async (req,res) => {
//     try {
//         const {email,password} = req.body;
//         if (!validator.isEmail(email)) {
//             throw new Error("Invalid credentials")
//         }
//         const user = await User.findOne({email: email})
//         if (!user) {
//             throw new Error("Invalid credentials")
//         }
//         const isPasswordValid = await bcrypt.compare(password,user.password)
//         console.log(password, user, isPasswordValid, 'isPasswordValid')
//         if (isPasswordValid) {
//             res.send("User logged in successfully")
//         } else {
//             throw new Error("Invalid credentials")
//         }

//     } catch(err) {
//         res.status(400).send("Error: " + err.message)
//     }
// })

// app.get("/feed", async (req,res) => {
//     try {
//         const users = await User.find({})
//         if (users.length ===0) {
//             res.status(400).send('users not found')
//         } else {
//             res.send(users)
//         }
//     } catch(err) {
//         res.status(404).send("failed to fetch users")
//     }
// })

// app.get("/user", async (req,res) => {
//     console.log(req.body)
//     try {
//         const users = await User.findOne({email: req.body.email})
//         if(!users) {
//             res.status(400).send('User not found')
//         } else {
//         res.send(users)
//         }
//     } catch(err) {
//         res.status(404).send("failed to fetch user details")
//     }
// })

// app.patch("/user/:userId", async (req,res) => {
//     const userId = req?.params?.userId;
//     const data = req.body;
//     try {
//         if (!userId) {
//             throw new Error("userId is manidatory")
//         }
//         const ALLOWED_FILEDS = ["gender","phone","skills", "about","password", "photoUrl"]
//         const isAllowed = Object.keys(data)?.every((key) => ALLOWED_FILEDS?.includes(key))
//         if (!isAllowed) {
//             throw new Error("Only gender,phone,skills,about,photoUrl,password fields are allowed to update")
//         }
//         if (data?.skills?.length > 3) {
//             throw new Error("only 3 skills allowed")
//         }
//         const user = await User.findByIdAndUpdate({_id: userId}, data, {
//             returnDocument: "after",
//             runValidators: true,
//         })
//         res.send(user)
//     } catch(err) {
//         res.status(400).send("Updated Failed: " + err.message)
//     }
// })



// app.post("/signup", async (req, res) => {
//   try {
//     validateSignupData(req.body)
//     const {firstName = '', lastName = '', email='',password='',gender='',photoUrl='' , about='',age=''} = req.body
//     const hashedPassword = await bcrypt.hash(password,10)
//     const newUser = new User({
//         firstName,lastName,email,password: hashedPassword,photoUrl,gender,age,about
//     });
//    await newUser.save()
//     res.send('User Added successfully')
//   } catch (err) {
//     res.status(400).send("Failed to add user" + err.message);
//   }
// });

// app.post("/login", async (req,res) => {
//     try {
//         const {email,password} = req.body;
//         if (!validator.isEmail(email)) {
//             throw new Error("Invalid credentials")
//         }
//         const user = await User.findOne({email: email})
//         if (!user) {
//             throw new Error("Invalid credentials")
//         }
//         const isPasswordValid = await user.isPasswordValidate(password)
//         if (isPasswordValid) {
//             const token = user.getJWT()
//             res.cookie("token", token)
//             res.send("User logged in successfully")
//         } else {
//             throw new Error("Invalid credentials")
//         }

//     } catch(err) {
//         res.status(400).send("Error: " + err.message)
//     }
// })

// app.get("/feed", async (req,res) => {
//     try {
//         const users = await User.find({})
//         if (users.length ===0) {
//             res.status(400).send('users not found')
//         } else {
//             res.send(users)
//         }
//     } catch(err) {
//         res.status(404).send("failed to fetch users")
//     }
// })

// app.get("/user", async (req,res) => {
//     const cookies = req.cookies
//     try {
//         const users = await User.findOne({email: req.body.email})
//         if(!users) {
//             res.status(400).send('User not found')
//         } else {
//         res.send(users)
//         }
//     } catch(err) {
//         res.status(404).send("failed to fetch user details")
//     }
// })

// app.patch("/user/:userId", async (req,res) => {
//     const userId = req?.params?.userId;
//     const data = req.body;
//     try {
//         if (!userId) {
//             throw new Error("userId is manidatory")
//         }
//         const ALLOWED_FILEDS = ["gender","phone","skills", "about","password", "photoUrl"]
//         const isAllowed = Object.keys(data)?.every((key) => ALLOWED_FILEDS?.includes(key))
//         if (!isAllowed) {
//             throw new Error("Only gender,phone,skills,about,photoUrl,password fields are allowed to update")
//         }
//         if (data?.skills?.length > 3) {
//             throw new Error("only 3 skills allowed")
//         }
//         const user = await User.findByIdAndUpdate({_id: userId}, data, {
//             returnDocument: "after",
//             runValidators: true,
//         })
//         res.send(user)
//     } catch(err) {
//         res.status(400).send("Updated Failed: " + err.message)
//     }
// })

// app.get("/profile", userAuth, async (req,res) => {
//     try {
//         const user = req.user
//         res.send(user)
//     } catch(err) {
//         res.status(400).send("ERROR: " + err.message)
//     }
// })