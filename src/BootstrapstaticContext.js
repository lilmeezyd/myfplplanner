import { createContext, useState, useEffect } from 'react'

export const BootstrapstaticContext = createContext({
    teams: [],
    players: [],
    playerPosition: [],
    events: [],
    fixtures: [],
    managerInfo: [],
    managerId: 0,
    getManagerInfo: () => {}
})

function BootstrapstaticProvider({children}) {

    const [players, setPlayers ] = useState([])
    const [teams, setTeams ] = useState([])
    const [events, setEvents ] = useState([])
    const [playerPosition, setPlayerPosition ] = useState([])
    const [ fixtures, setFixtures ] = useState([])
    const [ managerId, setManagerId ] = 
    useState(localStorage.getItem('managerId') === null ? 0 : localStorage.getItem('managerId'))
    const [ managerInfo, setManagerInfo ] = useState([])

    useEffect(() => {
        const fetchManagerInfo = async () => {
            const url = `https://corsproxy.io/?https://fantasy.premierleague.com/api/entry/${managerId}/`
            try {
                const response = await fetch(url)
                const data = await response.json()
                setManagerInfo(data)
            } catch(error) {
                console.log(error)
            }
        }
         {managerId > 0 && fetchManagerInfo()}

    }, [managerId])

    useEffect(() => {
        fetchData()
        fetchFixtures()

    }, [])

    

    const fetchFixtures = async () => {
        const url1 = `https://corsproxy.io/?https://fantasy.premierleague.com/api/fixtures/`
        try {
            const response = await fetch(url1)
            const data = await response.json()
            setFixtures(data)
        } catch(error) {
            console.log(error)
        }
    }

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

    const getManagerInfo = (id) => {
        setManagerId(id)
    }
    

    const contextValue = {
        players: players,
        teams: teams,
        events: events,
        playerPosition: playerPosition,
        fixtures: fixtures,
        managerId: managerId,
        managerInfo: managerInfo,
        getManagerInfo
    }

    return (
        <BootstrapstaticContext.Provider value={contextValue}>
            {children}
        </BootstrapstaticContext.Provider>
    )
}
export default BootstrapstaticProvider