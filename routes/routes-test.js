const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const Notes = require("../models/notes")

let openNote

app.use(bodyParser.urlencoded({extended: true}))

//SHOW NOTES
app.get("/", (req, res) => {
    Notes.find((err, notes) => {
        if (err) {
            console.log(err)
        } else {
            res.render("index", {notes: notes, open: openNote})
        }
    })
})

//OPEN NOTE
app.get("/:id", (req, res) => {
    Notes.find((err, notes) => {
        if (err) {
            console.log(err)
        } else {
            console.log(findNote(req.params.id));
            console.log(openNote);
            res.render("index", {notes: notes, open: openNote})
        }
    })
})

//CREATE NOTE
app.post("/create", async (req, res) => {
    const note = {
        name: req.body.name,
        content: req.body.content
    }
    openNote = await Notes.create(note)
    res.redirect("/")
})

//UPDATE NOTE
app.post("/:id", (req, res) => {
    // Notes.updateOne({"_id": req.params.id}, {$set: req.body}, {upsert: true}, (err, status) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(status);
    //     }
    // })

    if (findNote(req.params.id) != undefined) {
        Notes.findByIdAndUpdate(req.params.id, {$set: req.body}, {upsert: false}, (err, doc) => {
            if (err) {
                console.log(err);
            } else {
                openNote = doc
                res.redirect("/"+req.params.id)
            }
        })
    } else {
        res.redirect("/create")
    }
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

const findNote = (id) => {
    Notes.findById(id, (err, note) => {
        if (err) {
            console.log(err);
        } else {
            if(note != undefined) {
                openNote = note
            } else {
                console.log("Note is undefined");
            }
        }
    })
}

// //OPEN NOTE
// app.get("/open/:id", async (req, res) => {
    // Notes.findById(req.params.id, (err, note) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         openNote = note
    //         res.redirect("/")
    //     }
    // })
// })
