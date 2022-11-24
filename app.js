const express = require("express")
const app = express()
const routes = require("./routes/routes")

app.set("view engine", 'ejs')
app.use("/", routes)
app.use(express.static("public"))

app.listen(3000, () => console.log("App started"))