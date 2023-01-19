
export const numberOfFixtures = (events, gws) => {
    
    let fixtureNum = events.filter(event => new Date(event.deadline_time) > new Date()).length
    const fixOptions = []

    for(let i = fixtureNum; i >= 1; i--) {
        fixOptions.push(i)
    }

    const fixHeader = fixtureHeader(events, fixOptions.length, gws)
    return { fixOptions, fixHeader }
}

export const loadOpponents = (fixtures, teamId, gws) => {

    const teamA = fixtures.filter(fix => fix.team_a === teamId && !fix.finished && fix.event !== null)
    const teamH = fixtures.filter(fix => fix.team_h === teamId && !fix.finished && fix.event !== null)
    const teamHome = []
    const teamAway = []

    teamH.forEach(x => {
        const teamHomeObjt = {}
        const arr = []
        const arrObj = {}
        Object.keys(x).forEach(y => {
            if(y==='event') {
                teamHomeObjt.event = x['event']
            }
            if(y === 'team_h') {
                arrObj.venue = '(H)'
            }
            if(y === 'team_a') {
                arrObj.opponent = x['team_a']
            }
            if(y === 'team_h_difficulty') {
                arrObj.difficulty = x['team_h_difficulty']
            }
        })
        arr.push(arrObj)
        teamHomeObjt.arr = arr
        teamHome.push(teamHomeObjt)
    })
    
    teamA.forEach(x => {
        const teamAwayObjt = {}
        const arr = []
        const arrObj = {}
        Object.keys(x).forEach(y => {
            if(y==='event') {
                teamAwayObjt.event = x['event']
            }
            if(y === 'team_a') {
                arrObj.venue = '(A)'
            }
            if(y === 'team_h') {
                arrObj.opponent = x['team_h']
            }
            if(y === 'team_a_difficulty') {
                arrObj.difficulty = x['team_a_difficulty']
            }
        })
        arr.push(arrObj)
        teamAwayObjt.arr = arr
        teamAway.push(teamAwayObjt)
    })

    
    const teamAandH = [...teamHome, ...teamAway]

    teamAandH.sort((x,y) => {
        if(x['event'] > y['event']) return 1
        if(x['event'] < y['event']) return -1
    })

    function final(a,b) {
        return a.findLastIndex(x => x.event===b)
      }
    
    function initial(a,b) {
        return a.findIndex(x => x.event===b)
    } 
    
    teamAandH.forEach(x=>{
        let init = initial(teamAandH, x.event)
        let fin  = final(teamAandH, x.event)
        if(init === fin) {
            console.log(x.event)
        } else {
            teamAandH[init].arr.push(...teamAandH[fin].arr)
            teamAandH.splice(fin,1)
        }
    })

    const newTeamAandH = teamAandH.slice(0,gws)

    return {newTeamAandH}
}

const fixtureHeader = (events, fix, gws) => {
    return events
    		.filter(event => new Date(event.deadline_time) > new Date())
	    	.filter((event, key) => key <= (fix-1))
            .slice(0, gws)
}