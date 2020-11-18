const ical = require('node-ical')

const events = ical.sync.parseFile('cdate2.ics')

module.exports = {
    föreläsning : function (course){
        let returnmess1 = 'Nästa föreläsning i ' + course + ':'
        for (const event of Object.values(events)) {
            var type = event.summary.split(", ")
            if(type[0] == "Föreläsning" && type[1] == course){
                let returnmess2 =
                '\nInformation: ' + event.description +
                '\nDatum: ' + event.start.toDateString() +
                '\nTid: ' + event.start.toTimeString() + '\n'
                
                //Parse todays date
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0')
                var mm = String(today.getMonth() + 1).padStart(2, '0')
                var yyyy = today.getFullYear()
                today = parseInt(yyyy+mm+dd)
                
                //Parse incoming date
                date = event.start.toISOString().substring(0,10)
                newDate = date.split("-")
                totDate = parseInt(newDate[0]+newDate[1]+newDate[2])
                
                if(today <= totDate){
                return returnmess1 + returnmess2
                }
            } 
        }
        return "Det finns inga kommande föreläsningar i " + course
        
    }
    
}
    