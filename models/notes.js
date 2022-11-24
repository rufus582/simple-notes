const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://admin:admeme123@cluster0.3u4xtmc.mongodb.net/notesDB")

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("note", schema)