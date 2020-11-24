const ical = require('node-ical')

const events = ical.sync.parseFile('cdate2.ics')

module.exports = {

    /**
     * RETURNERA NÄSTA FÖRELÄSNING
     * @param {KURSKOD} course 
     */
    föreläsning : function (course){
        let returnmess1 = 'Nästa föreläsning i ' + course + ':'
        for (const event of Object.values(events)) {
            var type = event.summary.split(", ")
            if(type[0] == "Föreläsning" && type[1] == course){
                let returnmess2 =
                '\nInformation: ' + event.description +
                '\nDatum: ' + svensktDatum(event.start.toDateString()) +
                '\nTid: ' + event.start.toTimeString() + '\n'
                
                //Parse todays date
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0')
                var mm = String(today.getMonth() + 1).padStart(2, '0')
                var yyyy = today.getFullYear()
                var currentHour = today.getHours()
                if(currentHour < 10){
                    currentHour = "0"+currentHour
                }
                today = parseInt(yyyy+mm+dd+currentHour)
                
                //Parse incoming date
                date = event.start.toISOString().substring(0,10)
                calendarHour = event.start.toISOString().substring(11,13)
                newDate = date.split("-")
                totDate = parseInt(newDate[0]+newDate[1]+newDate[2]+calendarHour)+3
            
                if(today <= totDate){
                return returnmess1 + returnmess2
                }
            } 
        }
        return "Det finns inga kommande föreläsningar i " + course + "\n"
     },

     /**
      * AUTOMATISERAD PÅMINNELSE
      * OM FÖRELÄSNING
      */
    remindFöreläsning : function(){
        var i = 0
        const dates = []
        const lections = []
        for (const event of Object.values(events)) {
            var type = event.summary.split(", ")
            if(type[0] == "Föreläsning"){
            date = event.start.toISOString().substring(0,10)
            calendarHour = event.start.toISOString().substring(11,13)
            calendarHour = parseInt(calendarHour)+1
            if(calendarHour < 10){
                calendarHour = "0"+calendarHour
            }
            calendarMinute = event.start.toISOString().substring(14,16)
            calendarSecond = event.start.toISOString().substring(17,19)
            newDate = date.split("-")
            totDate = parseInt(newDate[0]+newDate[1]+newDate[2]+calendarHour.toString()+calendarMinute+calendarSecond)
            dates[i] = totDate
            lections[i] = event
            i++ 
            }          
        }     
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0')
        var yyyy = today.getFullYear()
        var currentHour = today.getHours()
        if(currentHour < 10){
            currentHour = "0"+currentHour
        }
        var currentMinute = today.getMinutes()
        if(currentMinute < 10){
            currentMinute = "0"+currentMinute
        }
        var currentSecond = today.getSeconds()
        if(currentSecond < 10){
            currentSecond = "0"+ currentSecond
        }
        today = parseInt(yyyy+mm+dd+currentHour+currentMinute+currentSecond)
        
        i=0
        var closestDate = dates[dates.length-1]
        var closestLection = []
        dates.forEach(function(date) {
           
            if(date<=closestDate && (date-today)>0){
                closestDate = date
                closestLection = lections[i]
            }
            i++
        });
        
        calenderDate = (closestDate).toString()
        calenderMonth = parseInt(calenderDate.substring(4,6))-1
        calenderDay = calenderDate.substring(6,8)
        calenderHour = calenderDate.substring(8,10)
        calenderMinute = calenderDate.substring(10,12)
        calenderSecond = calenderDate.substring(12,14)
        cronTime = calenderSecond + ' ' + calenderMinute + ' ' + calenderHour + ' ' + calenderDay + ' ' + calenderMonth + ' *'
        lectureInfo =
        'Nästa föreläsning börjar snart:\n' +
        '\n' + closestLection.summary + 
        '\nInformation: ' + closestLection.description +
        '\nDatum: ' + svensktDatum(closestLection.start.toDateString()) +
        '\nTid: ' + closestLection.start.toTimeString() + '\n'

        type = closestLection.summary.split(", ")
        return [cronTime, lectureInfo, type[1]]
   
    }
}
/**
 * Convert to swedish date format
 */
function svensktDatum(string){
    var date = string.split(" ")

    switch(date[0]){
        case 'Mon':
            date[0] = "Måndag"
        break;
        case 'Tue':
            date[0] = "Tisdag"
        break;  
        case 'Wed':
            date[0] = "Onsdag"
        break;
        case 'Thu':
            date[0] = "Torsdag"
        break;
        case 'Fri':
            date[0] = "Fredag"    
        break;
        case 'Sat':
            date[0] = "Lördag"
        break;
        case 'Sun':
            date[0] = "Söndag"
        break;
        default:
        //Do nothing
    }
    return date[0] + ' ' + date[2] + ' ' + date[1] + ' ' + date[3]
}




    