import { createContext, useState, useEffect } from 'react'

export const BootstrapstaticContext = createContext({
    teams: [],
    players: [],
    playerPosition: [],
    events: [],
    fixtures: [],
    managerInfo: [],
    managerHistory: [],
    managerPicks: [],
    transferHistory: [],
    managerId: 0,
    eventId: 0,
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
    const [ managerHistory, setManagerHistory ] = useState([])
    const [ managerPicks, setManagerPicks ] = useState([])
    const [ transferHistory, setTransferHistory ] = useState([])
    const [ eventId, setEventId ] = useState()

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

        const fetchManagerHistory = async () => {
            const url = `https://corsproxy.io/?https://fantasy.premierleague.com/api/entry/${managerId}/history/`
            try {
                const response = await fetch(url)
                const data = await response.json()
                setManagerHistory(data)
            } catch (error) {
                console.log(error)
            }
        }

        const fetchManagerPicks = async () => {
            const url = `https://corsproxy.io/?https://fantasy.premierleague.com/api/entry/${managerId}/event/21/picks/`
            try {
                const response = await fetch(url)
                const data = await response.json()
                setManagerPicks(data)
            } catch (error) {
                console.log(error)
            }
        }

        const fetchTransferHistory = async () => {
            const url = `https://corsproxy.io/?https://fantasy.premierleague.com/api/entry/${managerId}/transfers/`
            try {
                const response = await fetch(url)
                const data = await response.json()
                setTransferHistory(data)
            } catch (error) {
                console.log(error)
            }
        }
         {managerId > 0 && fetchManagerInfo()}
         {managerId > 0 && fetchManagerHistory()}
         {managerId > 0 && fetchManagerPicks()}
         {managerId > 0 && fetchTransferHistory()}

    }, [managerId, eventId])

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
            setEventId(data.events.filter(x => new Date(x.deadline_time) < new Date()).length)
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
        eventId: eventId,
        managerHistory: managerHistory,
        managerPicks: managerPicks,
        transferHistory: transferHistory,
        getManagerInfo
    }

    return (
        <BootstrapstaticContext.Provider value={contextValue}>
            {children}
        </BootstrapstaticContext.Provider>
    )
}
export default BootstrapstaticProvider