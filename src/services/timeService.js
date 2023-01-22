
export const getTime = () => {

}

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
    return { gameweeks, length }
}