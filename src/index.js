const express = require('express')

const app = express()

app.use('/get', (req,res) => {
    res.send("Hello world!")
})

app.listen(2326, () => {
    console.log("Server is listening successfully on 2326")
})