const request = require('request-promise')
const cheerio = require('cheerio')
const express = require('express')
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

fs.unlinkSync('./players.db')
fs.writeFile('players.db', '', (err) => {
    if(!err){
        console.log('players.db created successfully')
    }
})

var Datastore = require('nedb')
db = {}
db.players = new Datastore({filename: './players.db'})
db.players.loadDatabase()

getPagePlayers(1)
getPagePlayers(2)
getPagePlayers(3)
getPagePlayers(4)
getPagePlayers(5)

function getPagePlayers(pageNum){
    request(`https://www.futhead.com/23/players/?page=${pageNum}`, (err, res, html) => {
    if (!err && res.statusCode == 200) {
        const $ = cheerio.load(html)
        for(let i=3; i<=50; i++){
            playerObj = {}
            playerObj.type = 'player'
            playerObj.name = $(`.player-group-table li:nth-child(${i}) .player-name`).text()
            playerObj.rating = parseInt($(`.player-group-table li:nth-child(${i}) .player-rating:first-child`).text().trim().replace('\n', ''))
            playerObj.image = $(`.player-group-table li:nth-child(${i}) .player-image`).attr('data-src')
            playerObj.country = $(`.player-group-table li:nth-child(${i}) .player-nation`).attr('data-src')
            playerObj.clubImg = $(`.player-group-table li:nth-child(${i}) .player-club`).attr('data-src')
            playerObj.position = $(`.player-group-table li:nth-child(${i}) .player-club-league-name strong`).text()
            playerObj.club = $(`.player-group-table li:nth-child(${i}) .player-club-league-name`).text().replace('\n', '').replace('\n', '').replace('\n', '').replace('\n', '').replace('\n', '').trim().split('|')[1].trim()
            playerObj['league'] = $(`.player-group-table li:nth-child(${i}) .player-club-league-name`).text().replace('\n', '').replace('\n', '').replace('\n', '').replace('\n', '').replace('\n', '').trim().split('|')[2].trim()
            for(let j=1; j<=6; j++){
                playerObj[$(`.player-group-table li:nth-child(${i}) .player-right.text-center .player-stat:nth-child(${j}) .hover-label`).text()] = parseInt($(`.player-group-table li:nth-child(${i}) .player-right.text-center .player-stat:nth-child(${j}) .value`).text())
            }
            playerObj.link = "https://futhead.com"+$(`.player-group-table li:nth-child(${i}) a`).attr('href')
            playerObj.pageNum = pageNum
            playerObj.uniqueID = uuidv4()
            console.log(playerObj)
            db.players.insert(playerObj, (err, newDoc) => {
                if(!err){
                    console.log('database append succesful')
                }
            })
        }
    }
})
}