
const pageSize = 20
let curPage = 1

export const getMinMax = (players) => {
    let prices = []
    let maxPrice = Math.max(...players.map(x => (x.now_cost/10).toFixed(1)))
    let minPrice = Math.min(...players.map(x => (x.now_cost/10).toFixed(1)))
    
    for(let i=maxPrice; i>=minPrice; i-=0.5) {
        prices.push(+(i.toFixed(1)))
	
    }

    return { prices, minPrice, maxPrice }
} 

export const getPlayers = (players, sort, view) => {
    const returnedPlayers = players.filter((player, idx) => {
        let start = (curPage-1)*pageSize
        let end = curPage*pageSize
        if(idx >= start && idx < end) return true
    })

    const goalkeepers = returnedPlayers
    .filter((player => {
        if(player.element_type === 1) return true
    }))
    
    const defenders = returnedPlayers
    .filter((player => {
        if(player.element_type === 2) return true
    }))
                                
    const midfielders = returnedPlayers
    .filter((player => {
        if(player.element_type === 3) return true
    }))

    const forwards = returnedPlayers
    .filter((player => {
        if(player.element_type === 4) return true
    }))

    return { returnedPlayers, goalkeepers, defenders, midfielders, forwards}
}