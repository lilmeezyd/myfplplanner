
export const numberOfFixtures = (events) => {
    
    let fixtureNum = events.filter(event => new Date(event.deadline_time) > new Date()).length
    const fixOptions = []

    for(let i = fixtureNum; i >= 1; i--) {
        fixOptions.push(i)
    }
    return { fixOptions }
}