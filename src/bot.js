const { Console } = require('console')
const Discord = require('discord.js')
const client = new Discord.Client()
var calendar = require('./calendar');
const intro = "Välkommen till boten Dena v.0.1.1 \n \n Nuvarande funktionalitet: \n - Påminnelse till Robin och Tim att ta kafferast vid 15. \n - Ryter på Kevin ibland. \n \n Kommandon: \n !hjälp \n !dbas \n !dtek \n !orka"
var channelID = '672859315060867102'

client.on('ready', () => {
    var allmänt = client.channels.cache.get(channelID)
    console.log("Connected as " + client.user.tag)
    
    client.user.setActivity("PostgreSQL", {type: "PLAYING"})
    //allmänt.send(intro)
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
 * TA EMOT KOMMANDON
 * FRÅN ANVÄNDARE I SERVERN
 */
function processCommand(receivedMessage){
    let command = receivedMessage.content.substr(1)
    if(command == "hjälp"){
        receivedMessage.channel.send(intro)
    }

    if(command == "homework2"){
        receivedMessage.channel.send("Jag har rätt, du har fel.")
    }

    if(command == "dbas"){
        receivedMessage.channel.send(calendar.föreläsning("DD1368") +
            
            
            '\n Zoomlänk för föreläsningar i DD1368 - Databasteknik för D: \n https://kth-se.zoom.us/j/66050036484')
    }

    if(command == "dtek"){
        receivedMessage.channel.send(calendar.föreläsning("IS1500") +
            '\n Zoomlänk för föreläsningar i IS1500 - Datorteknik och komponenter: \n https://kth-se.zoom.us/j/63330111410')
    }

    if(command == "orka"){
        receivedMessage.channel.send(calendar.föreläsning("ME1010") +
            '\n Zoomlänk för föreläsningar i ME1010 - Organisations- och kunskapsintensivt arbete: \n https://kth-se.zoom.us/j/3927870344?pwd=SjNYWG9vWk00bEZQU2N6Z0srQTF6dz09')
    }
}


//Sätt igång alla tidsbaserade rutiner
kevinRyt()
kaffeRast()

client.login("Nzc3OTczMjc2MjkwNTgwNTYw.X7LOEw.tuEsTgtstU9sTqaGHsUFW1yi8xY")

