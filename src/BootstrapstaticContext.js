import { createContext, useState, useEffect } from 'react'

export const BootstrapstaticContext = createContext({
    teams: [],
    players: [],
    playerPosition: [],
    events: [],
    loadPlayers: () => {},
    loadPrices: () => {}
})

function BootstrapstaticProvider({children}) {

    const [players, setPlayers ] = useState([])
    const [teams, setTeams ] = useState([])
    const [events, setEvents ] = useState([])
    const [playerPosition, setPlayerPosition ] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const url = `https://corsproxy.io/?https://fantasy.premierleague.com/api/bootstrap-static/`
        try {
            const response = await fetch(url)
            const data = await response.json()
            setPlayers(data.elements)
            setTeams(data.teams)
            setEvents(data.events)
            setPlayerPosition(data.element_types)
        } catch (error) {
            console.log(error)
        }

    }

    function loadPlayers() {}
    function loadPrices() {}
    

    const contextValue = {
        players: players,
        teams: teams,
        events: events,
        playerPosition: playerPosition,
        loadPlayers,
        loadPrices
    }

    return (
        <BootstrapstaticContext.Provider value={contextValue}>
            {children}
        </BootstrapstaticContext.Provider>
    )
}
export default BootstrapstaticProvider