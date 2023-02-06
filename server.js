const express = require('express')
app = express()

app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/magic", function (req, res) {
  res.render("magic");
});

app.listen(8080, function () {
  console.log("Server is running on port 8080 ");
});