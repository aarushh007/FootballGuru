const request = require('request-promise')
const cheerio = require('cheerio')
const express = require('express')
const sqlite3 = require('sqlite3').verbose();
app = express()

var Datastore = require('nedb')
db = {}
db.players = new Datastore({filename: './players.db'})
db.players.loadDatabase()

app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/players", (req, res) => {
    x = req.query.page ? req.query.page : 1;
    x = parseInt(x)
    db.players.find({pageNum: x}).sort({rating: -1, name:1}).exec(function(err, docs){
        res.render('players', {players: docs})
    })
})

app.listen(8080, function () {
  console.log("Server is running on port 8080 ");
});