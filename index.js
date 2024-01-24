const express = require("express");
const path = require("path");

const app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/static", express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/names", (req, res) => {
    res.render("names");
});

if (process.env.LOCAL) {
    app.listen(80, "0.0.0.0",
        () => console.log("App listening on port 3000"));
}


// maybe add: api for getting GeometrySpace & other stuff ?
