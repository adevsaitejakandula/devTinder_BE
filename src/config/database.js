const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://saitejakandula26_db_user:fJKaSaK21OZwMLCZ@cluster0.dk3tmgi.mongodb.net/devTinder')
}

module.exports = {connectDB}