const express = require('express')

const app = express()

// app.use('/get', (req,res) => {
//     res.send("Hello world!")
// })

app.get("/user" , (req,res) => {
    res.send({
        "firstname": "sai",
        "lastname": "teja"
    })
})

app.post("/user", (req,res) => {
    console.log("Saved Data to data base")
    res.send("Data Successfully saved to Data base")
})

app.delete("/user", (req,res) => {
    console.log("deleted user successfully")
    res.send("user Deleted successfully")
})

app.listen(2326, () => {
    console.log("Server is listening successfully on 2326")
})