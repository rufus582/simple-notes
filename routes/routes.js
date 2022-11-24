const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const Notes = require("../models/notes")

let notesData

app.use(bodyParser.urlencoded({extended: true}))

//SHOW NOTES
app.get("/", (req, res) => {
    Notes.find((err, notes) => {
        if (err) {
            console.log(err)
        } else {
            notesData = notes
            res.render("index", {notes: notesData, showInd: 0})
        }
    })
})

//OPEN NEW NOTE PAGE
app.get("/new", (req, res) => {
    res.render("new-note", {edit: false})
})

//CREATE NOTE
app.post("/new", async (req, res) => {
    const note = {
        name: req.body.name,
        content: req.body.content
    }
    await Notes.create(note)
    res.redirect("/")
})

app.get("/edit/:index", (req, res) => {
    res.render("new-note", {edit: true, index: req.params.index, notes: notesData})
})

//UPDATE NOTE
app.post("/edit/:id", (req, res) => {
    Notes.findByIdAndUpdate(req.params.id, {$set: req.body}, {upsert: false}, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/")
        }
    })
})

//DELETE NOTE
app.post("/delete/:id", async (req, res) => {
    const status = await Notes.deleteOne({"_id": req.params.id})
    if(status.acknowledged) {
        res.redirect("/")
    } else {
        res.send("Some error occurred, cannot delete the note")
    }
})

//OPEN NOTE
app.get("/:index", (req, res) => {
    res.render("index", {notes: notesData, showInd: req.params.index})
})

module.exports = app