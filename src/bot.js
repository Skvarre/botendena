const { Console } = require('console')
const Discord = require('discord.js')
const client = new Discord.Client()
//const ytdl = require('ytdl-core')
//const ytSearch = require('yt-search')
var calendar = require('./calendar')
const intro = "Välkommen till boten Dena v.2021/22 (LTS hehe skoja)  \n Nuvarande funktionalitet: \n - Meddelar när en föreläsning börjar. \n \n Kommandon: \n !hjälp\n !schema\n !os\n !hållut\n !adk" 
var channelID = '672859315060867102'

client.on('ready', () => {
    
    console.log("Connected as " + client.user.tag)
    //** Använd detta för att posta meddelande vid uppstart. */
    var allmant = client.channels.cache.get(channelID)
    // allmant.send("Please be my TA, Niklas W. It's for you guys.")
    client.user.setActivity("Niklas become TA", {type: "WATCHING"})
})

client.on('message', (receivedMessage) => {
    
    if(receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }
})


function kaffeRast(){
const cron = require('cron')
var today = new Date()
if(today.getHours() >= 15){ 
    today.setDate(today.getDate() + 1)
}
console.log(today.getDate())
let kaffeRastJob = new cron.CronJob('00 00 15 ' + today.getDate() + ' * *', () => {
    var allmänt = client.channels.cache.get(channelID)
    //Kör varje dag vid 15 
    let skvarre = '<@226405245461331969>'
    let rebin = '<@247056908962234369>'
    allmänt.send(skvarre + " och " + rebin + " dags för kafferast.")
    kaffeRast()
    })
kaffeRastJob.start()
}

/**
 * SKICKA UT DAGENS SCHEMA VARJE DAG KL 8 
 */
function dagensSchema(){
    const cron = require('cron')
    var today = new Date()
    if(today.getHours() >= 15){ 
        today.setDate(today.getDate() + 1)
    }   
    let schema = new cron.CronJob('00 00 08 ' + today.getDate() + ' * *', () => {
        var allmant = client.channels.cache.get(channelID)

        dagensSchema()
    })

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
        allmant.send(info[1] + zoomLänk(info[2],info[3]))
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

    if(command == "os"){
        kurskod = "ID1200"
        receivedMessage.channel.send(calendar.föreläsning("ID1200") + zoomLänk(kurskod))
    }

    if(command == "adk"){
        kurskod = "DD2350"
        receivedMessage.channel.send(calendar.föreläsning("DD2350") + zoomLänk(kurskod))
    }

    if(command == "hållut"){
        kurskod = "AL1504"
        receivedMessage.channel.send(calendar.föreläsning("AL1504") + zoomLänk(kurskod))
    }

    if(command == "schema"){
        receivedMessage.channel.send("|1| Idag\n|2| Imorgon\n|3| Övermorgon")
        const filter = (m) => m.author.id === receivedMessage.author.id
        receivedMessage.channel.awaitMessages(filter, {max: 1, time: 5000})
            .then((collected)=> {
                  if(collected.first().content > 0 && collected.first().content < 4){
                receivedMessage.channel.send(calendar.dagensSchema(collected.first().content))
            }else{
                receivedMessage.channel.send("Discarded.")
            }
            })
    }

    if(command == "ångest"){
        receivedMessage.delete()
        receivedMessage.channel.send("Har du ångest?")
        const filter = (m) => m.author.id === receivedMessage.author.id
        receivedMessage.channel.awaitMessages(filter, {max: 1, time: 5000})
            .then((collected)=> {
                 if(collected.first().content.toLowerCase().includes("ja")){
                    var channelID = '891689128377327666'
                    try{
                        receivedMessage.member.voice.setChannel(client.channels.cache.get(channelID))
                        
                    }catch(e){
                        receivedMessage.channel.send("Mm, gick inte så bra det där.")
                        
                    }
                 }else{
                    receivedMessage.channel.send("Discarded för helvete.")
                }
            })
    }


}


function zoomLänk(kurskod, typ){
    switch(kurskod){
    case "AL1504":
        return '\nZoomlänk för föreläsning i AL1504 - Hållbar utveckling för datateknik -  \nhttps://kth-se.zoom.us/j/65527551312'
    case "DD2350":
        if(typ == "övning"){
            return '\nZoomlänk för övning i DD2350 - Algoritmer, datastrukturer & komplexitet: \n https://kth-se.zoom.us/j/65919847882 (David Avellan-Hultman)'
        }else{
            return '\nFöreläsningar i ADK numera på plats?'
        }
    case "ID1200":
        if(typ == "övning"){
            return '\nHålls det zoomövningar i OS? Vet inte vad zoomlänken är Mvh, Dena. Long story short'
        }else{
            return '\nZoomlänk för fucking pratstund i ID1200 - Operativsystem:\nhttps://kth-se.zoom.us/j/61436972584?pwd=bkJjdXkyTkZtc0hGTFE0NmovcFlydz09.'
        }
    default:
        return
    }
}

//Sätt igång alla tidsbaserade rutiner
//kevinRyt()
kaffeRast()
remindFöreläsning()

const fs = require("fs");
fs.readFile("botpassword.txt", (error, data) => {
    if(error) {
        throw error;
    }
    client.login(data.toString());
});