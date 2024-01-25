const express = require("express");
const path = require("path");

const app = express();
module.exports = exports = app;

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/names", (req, res) => {
    res.render("names");
});

if (process.env.LOCAL) {
    app.listen(3000, "0.0.0.0",
        () => console.log("App listening on port 3000"));
}


// maybe add: api for getting GeometrySpace & other stuff ?
