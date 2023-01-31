export const getPicks = (players, picks, curPage, curSize) => {
    const returnedPicks = picks
                            .filter((x, idx) => {
                                let start = (curPage-1)*curSize
                                let end = curPage*curSize
                                if(idx >= start && idx < end) return true
                            })
    
    const goalkeeper = returnedPicks[0].newPicks.filter((goalie => {
        let player = players.find(x => x.id === goalie.element)
        if(player.element_type === 1 && (goalie.multiplier !== 0)) return true
    })).sort((a,b) => {
        if(a.position < b.position) return -1
        if(a.position > b.position) return 1
    })
    
    const defenders = returnedPicks[0].newPicks.filter((defend => {
        let player = players.find(x => x.id === defend.element)
        if(player.element_type === 2 && (defend.multiplier !== 0)) return true
    })).sort((a,b) => {
        if(a.position < b.position) return -1
        if(a.position > b.position) return 1
    })

    const midfielders = returnedPicks[0].newPicks.filter((midfield => {
        let player = players.find(x => x.id === midfield.element)
        if(player.element_type === 3 && (midfield.multiplier !== 0)) return true
    })).sort((a,b) => {
        if(a.position < b.position) return -1
        if(a.position > b.position) return 1
    })

    const forwards = returnedPicks[0].newPicks.filter((forw => {
        let player = players.find(x => x.id === forw.element)
        if(player.element_type === 4 && (forw.multiplier !== 0)) return true
    })).sort((a,b) => {
        if(a.position < b.position) return -1
        if(a.position > b.position) return 1
    })

    const benched = returnedPicks[0].newPicks.filter(bench => {
        if(bench.multiplier === 0) return true
    }).sort((a,b) => {
        if(a.position < b.position) return -1
        if(a.position > b.position) return 1
    })
    
    return { goalkeeper, defenders, midfielders, forwards, benched }
    
}
