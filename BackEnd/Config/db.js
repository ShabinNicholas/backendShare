const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI)

const db = mongoose.connection

db.on('error', (err) => {
    console.log(`Database error: ${err}`);
})

db.once('open', () => {
    console.log('Database connected');
})

module.exports = db