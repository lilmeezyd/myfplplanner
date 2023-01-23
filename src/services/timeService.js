
export const getGameweeks = (events, curPage, curSize) => {
    const length =  events
                    .filter(event => new Date(event.deadline_time) > new Date()).length
    const gameweeks = events
                        .filter(event => new Date(event.deadline_time) > new Date())
                        .map(event => event.name)
                        .filter((event, idx) => {
                            let start = (curPage-1)*curSize
                            let end = curPage*curSize
                            if(idx >= start && idx < end) return true
                        } )
    const deadlines = events
                        .filter(event => new Date(event.deadline_time) > new Date())
                        .map(event => event.deadline_time)
    const deadlineTimes = getTime(deadlines)
    const countdowns =  deadlineTimes.filter((deadline, idx) => {
                                let start = (curPage-1)*curSize
                                let end = curPage*curSize
                                if(idx >= start && idx < end) return true
                            })                               
    return { gameweeks, length, countdowns }
}

const getTime = (deadlines) => {
    const newDeadlines = []
    deadlines.forEach(deadline => {
        const timeObj = {}
        let millis = new Date(deadline)-new Date()
        let seconds = Math.floor(millis/1000)
        let formattedseconds = seconds >= 60 ? seconds%60 : seconds
        let newseconds = formattedseconds <= 9 ? `0${formattedseconds}` : formattedseconds
        let minutes = Math.floor(seconds/60)
        let formattedminutes = minutes >= 60 ? minutes%60 : minutes
        let newminutes = formattedminutes <= 9 ? `0${formattedminutes}` : formattedminutes
        let hours = Math.floor(minutes/60)
        let formattedhours = hours >= 24 ? hours%24 : hours
        let newhours = formattedhours <= 9 ? `0${formattedhours}` : formattedhours
        let days = Math.floor(hours/24)
        let newdays = days <= 9 ? `0${days}` : days
        if(millis <= 0) {
            timeObj.days = '00'
            timeObj.hours = '00'
            timeObj.minutes = '00'
            timeObj.seconds = '00'
        } else {
            timeObj.days = newdays
            timeObj.hours = newhours
            timeObj.minutes = newminutes
            timeObj.seconds = newseconds
        }
        newDeadlines.push(timeObj)
    })
    return newDeadlines
}