
export const numberOfFixtures = (events, gws) => {
    
    let fixtureNum = events.filter(event => new Date(event.deadline_time) > new Date()).length
    const fixOptions = []

    for(let i = fixtureNum; i >= 1; i--) {
        fixOptions.push(i)
    }

    const fixHeader = fixtureHeader(events, fixOptions.length, gws)
    return { fixOptions, fixHeader }
}

const fixtureHeader = (events, fix, gws) => {
    return events
    		.filter(event => new Date(event.deadline_time) > new Date())
	    	.filter((event, key) => key <= (fix-1))
            .slice(0, gws)
}