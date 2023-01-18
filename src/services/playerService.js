//let curPage = 1

export const getMinMax = (players) => {
    let prices = []
    let maxPrice = players.length > 0 ? 
    Math.max(...players.map(x => (x.now_cost/10).toFixed(1))) : 0
    let minPrice = players.length > 0 ?  
    Math.min(...players.map(x => (x.now_cost/10).toFixed(1))) : 0
    
    for(let i=maxPrice; i>=minPrice; i-=0.5) {
        prices.push(+(i.toFixed(1)))
	
    }

    return { prices, minPrice, maxPrice }
} 

export const getPlayers = (players, sort, view, word, cutPrice) => {
    let id
    const filteredPlayers = []
    if(view.startsWith('position')) {
        id = +view.slice(-1)
        filteredPlayers.push(...players.filter(x => x.element_type === id))
    } else if(view.startsWith('team')) {
        id = +view.slice(5)
        filteredPlayers.push(...players.filter(x => x.team === id))
    } else {
        filteredPlayers.push(...players)
    }
    
    const returnedPlayers = filteredPlayers
                            .sort((x,y) => {
                                if(x[sort]>y[sort]) return -1
                                if(x[sort]<y[sort]) return 1
                            })
                            .filter(player => +(player.now_cost/10).toFixed(1)<=cutPrice)
                            .filter(player => {
                                if(player.web_name.toLowerCase().startsWith(word?.toLowerCase())) return true
                            })

    

    return { returnedPlayers }
}

export const getArrangedPlayers = (players, curPage, pageSize) => {
    const returnedPlayers = players
                            .filter((player, idx) => {
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

    return { goalkeepers, defenders, midfielders, forwards}
}



