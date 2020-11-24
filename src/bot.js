const { Console } = require('console')
const Discord = require('discord.js')
const client = new Discord.Client()
var calendar = require('./calendar');
const intro = "Välkommen till boten Dena v.0.1.2 \n \n Nuvarande funktionalitet: \n - Påminnelse till Robin och Tim att ta kafferast vid 15. \n - Ryter på Kevin ibland. \n - Meddelar när en föreläsning börjar. \n \n Kommandon: \n !hjälp      !pip\n !dbas \n !dtek \n !orka \n\n Planerad funktionalitet:\n-Kommando för att visa dagens schema\n-Kommando för att visa deadlines" 
var channelID = '672859315060867102'

client.on('ready', () => {
    var allmant = client.channels.cache.get(channelID)
    console.log("Connected as " + client.user.tag)
    //allmant.send(intro)
    client.user.setActivity("students fail", {type: "WATCHING"})
})

client.on('message', (receivedMessage) => {
    
    if(receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }
})

function kaffeRast(){
const cron = require('cron')
let kaffeRast = new cron.CronJob('00 00 15 * * *', () => {
    var allmänt = client.channels.cache.get(channelID)
    //Kör varje dag vid 15 
    let skvarre = '<@226405245461331969>'
    let rebin = '<@247056908962234369>'
    allmänt.send(skvarre + " och " + rebin + " dags för kafferast.")
    })
kaffeRast.start()
}

function kevinRyt(){
let randomHour = Math.floor((Math.random()*10)+8)
let randomMinute = Math.floor((Math.random()*60))
const cron = require('cron')
let kevinRyt = new cron.CronJob('00 ' + randomMinute + ' ' + randomHour + ' * * *', () => {
    var allmänt = client.channels.cache.get(channelID)
    let kevin = '<@143101911913070593>'
    var ryt = [" your homework assignment does not fulfill the grading criteria. Please correct your work accordingly.",
    " your lab has bad constraints.",
    " this database does not fulfill BCNF",
    " primary keys are marked with underscore, not bold text. 0/10.",
    " zero motivation on any design choices. 0/10.",
    " instant fail.",
    " you are required to use the sample set, but also take into consideration that it is sample data.",
    " the sample data should not derive your design but support it. 0/10.",
    " support for age depends on your design solution. Instant fail",
    " I hope you have good day. 0/10."
    ]
    allmänt.send(kevin + ryt[Math.floor((Math.random()*10))])
    })
kevinRyt.start()
}

/**
 * HÄMTA NÄSTKOMMANDE FÖRELÄSNING
 * PUSHA UT INFO NÄR FÖRELÄSNINGEN BÖRJA
 * REKURSIV FUNKTION - HÄMTA ALLTID NÄSTKOMMANDE FÖRELÄSNING EFTER INFO PUSHATS
 * 
 * OBS SAKNAR BASE CASE, KOMMER PRUTTA NER SIG OM KALENDERN TAR SLUT.
 */
function remindFöreläsning(){
    info = calendar.remindFöreläsning()
    console.log(info[0])
    const cron = require('cron')
    let remindFöreläsningJob = new cron.CronJob(info[0], () => {
        var allmant = client.channels.cache.get(channelID)
        allmant.send(info[1] + zoomLänk(info[2]))
        remindFöreläsning()
        })
    remindFöreläsningJob.start()
}


/**
 * TA EMOT KOMMANDON
 * FRÅN ANVÄNDARE I SERVERN
 */
function processCommand(receivedMessage){
    let command = receivedMessage.content.substr(1)
    command = command.toLowerCase()
    if(command == "hjälp"){
        receivedMessage.channel.send(intro)
    }

    if(command == "homework2"){
        receivedMessage.channel.send("Long story short - jag har rätt, du har fel.")
    }

    if(command == "dbas"){
        kurskod = "DD1368"
        receivedMessage.channel.send(calendar.föreläsning(kurskod) + zoomLänk(kurskod))
    }

    if(command == "dtek"){
        kurskod = "IS1500"
        receivedMessage.channel.send(calendar.föreläsning("IS1500") + zoomLänk(kurskod))
    }

    if(command == "orka"){
        kurskod = "ME1010"
        receivedMessage.channel.send(calendar.föreläsning("ME1010") + zoomLänk(kurskod))
    }

    if(command == "pip"){
        kurskod = "DD1369"
        receivedMessage.channel.send(calendar.föreläsning("DD1369") + zoomLänk(kurskod))
    }
}

function zoomLänk(kurskod){
    switch(kurskod){
    case "DD1368":
        return '\nZoomlänk för föreläsningar i DD1368 - Databasteknik för D:\nhttps://kth-se.zoom.us/j/66050036484'
    case "ME1010":
        return '\nZoomlänk för föreläsningar i ME1010 - Organisations- och kunskapsintensivt arbete:\nhttps://kth-se.zoom.us/j/3927870344?pwd=SjNYWG9vWk00bEZQU2N6Z0srQTF6dz09'
    case "IS1500":
        return '\nZoomlänk för föreläsningar i IS1500 - Datorteknik och komponenter:\nhttps://kth-se.zoom.us/j/63330111410'
    case "DD1369":
        return '\nZoomlänk för föreläsningar i DD1369 - Programvarukonstruktion i projektform:\nhttps://kth-se.zoom.us/j/63398077675'
    case "DD1351":
        return '\nCanvaslänk för förinspelade föreläsningar i DD1351 - Logik för dataloger:\nhttps://canvas.kth.se/courses/20920/pages/forelasningar?module_item_id=244346\nZoomlänk för frågor eller om man vill tillsammans med Johan titta på hans förinspelade föreläsningar:\nhttps://kth-se.zoom.us/j/68079633105'
    default:
        return
    }
}

//Sätt igång alla tidsbaserade rutiner
kevinRyt()
kaffeRast()
remindFöreläsning()

const fs = require("fs");
fs.readFile("botpassword.txt", (error, data) => {
    if(error) {
        throw error;
    }
    client.login(data.toString());
});