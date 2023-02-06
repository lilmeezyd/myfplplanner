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
    picks: [],
    real: [],
    chips: {},
    transferLogic: {},
    transfers: [],
    managerId: 0,
    eventId: 0,
    getManagerInfo: () => {},
    updateWildcard: () => {}
})

function BootstrapstaticProvider({children}) {

    const [players, setPlayers ] =  useState([])
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
    const [ eventId, setEventId ] = useState(0)
    const [ chips, setChips ] = useState({
        wildcard: { used: false, event: null},
        bboost: { used: false, event: null},
        freehit: { used: false, event: null},
        tcap: { used: false, event: null}
    })

    const [ transferLogic, setTransferLogic ] = useState({
        rolledFt: false,
        tc: 0,
        fts: 1
    })

    const [ picks, setPicks ] = 
    useState(localStorage.getItem('managerId') === null ? [] : JSON.parse(localStorage.getItem('picks')) )
    const [ real, setReal ] = useState([])
    const [ transfers, setTransfers ] = useState([])

  

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
                let wildcardLength = data.chips.filter(x => x.name === 'wildcard').length
                let wildcard = data.chips.some(x => x.name === 'wildcard') && wildcardLength === 2 ? true : 
                wildcardLength === 1 && data.chips.filter(x => x.name === 'wildcard')[0].time > new Date('2022/12/26/14:00').toISOString() ? true : false

                let bboost = data.chips.some(x => x.name === 'bboost') ? true : false
                let freehit = data.chips.some(x => x.name === 'freehit') ? true : false
                let tcap = data.chips.some(x => x.name === '3xc') ? true : false

                let wEvent = wildcardLength === 2 ? 
                data.chips.filter(x => x.name === 'wildcard')[1].event : 
                wildcardLength === 1 && data.chips.filter(x => x.name === 'wildcard')[0].time > new Date('2022/12/26/14:00').toISOString() ? 
                data.chips.filter(x => x.name === 'wildcard')[0].event : null
        
                //let wEvent = wildcard === true ? data.chips.filter(x => x.name === 'wildcard')[0].event : null
                let bEvent = bboost === true ? data.chips.filter(x => x.name === 'bboost')[0].event : null
                let fEvent = freehit === true ? data.chips.filter(x => x.name === 'freehit')[0].event : null
                let tEvent = tcap === true ? data.chips.filter(x => x.name === '3xc')[0].event : null
        
                setChips({...chips, 
                    wildcard: {used: wildcard, event: wEvent},
                    bboost: {used: bboost, event: bEvent},
                    freehit: {used: freehit, event: fEvent},
                    tcap: {used: tcap, event: tEvent}})
                
                
                localStorage.removeItem('chips')
                localStorage.setItem('chips', JSON.stringify(chips))    
                
                const { current } = data
                let fts = 1
                returnFt(1, current.length, fts)
                //rolledft = fts === 1 ? false : 2
                function returnFt(a, b, c) {
                    if(a === b) {
                        fts = c
                        setTransferLogic({
                            ...transferLogic, fts:fts,
                            rolledFt: fts === 1 ? false : true
                        })
                        return;
                    }
                    if(current[a].event_transfers === 0 && current[a].event !== chips.wildcard.event) {
                        c = 2
                    }
                    if(current[a].event_transfers === 0 && current[a].event === chips.wildcard.event) {
                        c = 1
                    }
                    if(current[a].event_transfers === 0 && current[a].event === chips.freehit.event) {
                        c = 1
                    }
                    if(current[a].event_transfers > 1) {
                        c = 1
                    }
                    if(current[a].event_transfers === 1 && c === 1) {
                        c = 1
                    }
                    if(current[a].event_transfers === 1 && c === 2) {
                        c = 2
                    }
                    a+=1
                    returnFt(a, b, c)
                }    
            } catch (error) {
                console.log(error)
            }
        }

        const fetchManagerPicks = async () => {
            const url = `https://corsproxy.io/?https://fantasy.premierleague.com/api/entry/${managerId}/event/${eventId}/picks/`
            try {
                const response = await fetch(url)
                const data = await response.json()
                setManagerPicks(data)

                //let buyingPrice
                const newPicks = []
   				const realPicks = []
   				const newPicksHyp = []
   				const realPicksHyp = []
                const gameweekPicks = []
                const gameweekTransfers = []
				const transferPlayers = []
				let bank, value

                // Resetting Team to state before auto-subs
				if(data.automatic_subs.length > 0) {
					data.picks.map(x => {
						let found = data.automatic_subs.some(player => player.element_in === x.element)
						if(found) {
							let autoIn = data.automatic_subs.find(player => player.element_in === x.element)
							let autoOut = data.picks.find(player => player.element === autoIn.element_out)
							let autoInMultiplier = x.multiplier
							let autoOutMultiplier = autoOut.multiplier
							let autoInPosition = x.position
							let autoOutPosition = autoOut.position
							x.multiplier = autoOutMultiplier
							x.position = autoOutPosition
							autoOut.position = autoInPosition
							autoOut.multiplier = autoInMultiplier

						}
					})
				} else {
					data.picks.map(x => x)
				}

                data.picks.forEach(x => {
					transferHistory.forEach(y => {
						if(x.element === y.element_in) {
							//Removing duplicate entries
							let isFound = transferPlayers.some(player => player.element === y.element_in)
							if(isFound) {
								return;
							} else {
								transferPlayers
							.push({element:y.element_in, element_in_cost:y.element_in_cost})
						}
						}
					})
				})

                data.picks.forEach(x => {
					players.forEach(y => {
						if(y.id === x.element) {
							let now_cost = (y.now_cost/10).toFixed(1)
							let price_change = (y.cost_change_start/10).toFixed(1)
							newPicksHyp.push({...x, disabled:true, element_out:null, element_type:y.element_type, team:y.team, now_cost, price_change})
							realPicksHyp.push({...x, disabled:true,element_out:null, element_type:y.element_type, team:y.team, now_cost, price_change})
						}
					})
				})

                // Adding selling prices and buying prices to the picks
				newPicksHyp.forEach(x => {
                    let selling_price, formattedCost, profit, actualProfit, element_in_cost
					let isFound = transferPlayers.some(player => player.element === x.element)
					if(isFound) {
						element_in_cost = transferPlayers.find(player => player.element === x.element).element_in_cost
						formattedCost = (element_in_cost/10).toFixed(1)
						profit = +((+x.now_cost - +formattedCost).toFixed(1))
						actualProfit = (profit*10) % 2 === 0 ? 'even' : 'odd'
						if(actualProfit === 'even') {
							if(+profit < 0 ) {
								selling_price = (+(+(profit).toFixed(2).slice(0,4)) + +formattedCost).toFixed(1)
							} else {
							selling_price = (+((+profit/2).toFixed(1)) + +formattedCost).toFixed(1)
						}
						} else {
							if(+profit < 0 ) {
								selling_price = (+(+(profit).toFixed(2).slice(0,4)) + +formattedCost).toFixed(1)
							}
								else {
							selling_price = (+(+(profit/2).toFixed(2).slice(0,3)) + +formattedCost).toFixed(1)
						}
						}
						newPicks.push({...x, selling_price, element_in_cost:formattedCost})
					} else {
						formattedCost = (+x.now_cost - +x.price_change).toFixed(1)
						profit = +((+x.now_cost - +formattedCost).toFixed(1))
						actualProfit = (profit*10) % 2 === 0 ? 'even' : 'odd'
						//profit = ((+x.now_cost - +formattedCost)/2).toFixed(1)
						if(actualProfit === 'even') {
							if(+profit < 0 ) {
								selling_price = (+(+(profit).toFixed(2).slice(0,4)) + +formattedCost).toFixed(1)
							} else {
							selling_price = (+((+profit/2).toFixed(1)) + +formattedCost).toFixed(1)
						}
						} else {
							if(+profit < 0 ) {
								selling_price = (+(+(profit).toFixed(2).slice(0,4)) + +formattedCost).toFixed(1)
							}
								else {
							selling_price = (+(+(profit/2).toFixed(2).slice(0,3)) + +formattedCost).toFixed(1)
						}
						}
						newPicks.push({...x, selling_price, element_in_cost:formattedCost})
					}
				})

                /* Adding selling prices and buying prices to picks to be used on reset for
		         the first gw in the ui */
				realPicksHyp.forEach(x => {
                    let selling_price, formattedCost, profit, actualProfit, element_in_cost
					let isFound = transferPlayers.some(player => player.element === x.element)
					if(isFound) {
						element_in_cost = transferPlayers.find(player => player.element === x.element).element_in_cost
						formattedCost = (element_in_cost/10).toFixed(1)
						profit = +((+x.now_cost - +formattedCost).toFixed(1))
						actualProfit = (profit*10) % 2 === 0 ? 'even' : 'odd'
						if(actualProfit === 'even') {
							if(+profit < 0 ) {
								selling_price = (+(+(profit).toFixed(2).slice(0,4)) + +formattedCost).toFixed(1)
							} else {
							selling_price = (+((+profit/2).toFixed(1)) + +formattedCost).toFixed(1)
						}
						} else {
							if(+profit < 0 ) {
								selling_price = (+(+(profit).toFixed(2).slice(0,4)) + +formattedCost).toFixed(1)
							}
								else {
							selling_price = (+(+(profit/2).toFixed(2).slice(0,3)) + +formattedCost).toFixed(1)
						}
						}
						realPicks.push({...x, selling_price, element_in_cost:formattedCost})
					} else {
						formattedCost = (+x.now_cost - +x.price_change).toFixed(1)
						profit = +((+x.now_cost - +formattedCost).toFixed(1))
						actualProfit = (profit*10) % 2 === 0 ? 'even' : 'odd'
						//profit = ((+x.now_cost - +formattedCost)/2).toFixed(1)
						if(actualProfit === 'even') {
							if(+profit < 0 ) {
								selling_price = (+(+(profit).toFixed(2).slice(0,4)) + +formattedCost).toFixed(1)
							} else {
							selling_price = (+((+profit/2).toFixed(1)) + +formattedCost).toFixed(1)
						}
						} else {
							if(+profit < 0 ) {
								selling_price = (+(+(profit).toFixed(2).slice(0,4)) + +formattedCost).toFixed(1)
							}
								else {
							selling_price = (+(+(profit/2).toFixed(2).slice(0,3)) + +formattedCost).toFixed(1)
						}
						}
						realPicks.push({...x, selling_price, element_in_cost:formattedCost})
					}
				})
                
                bank = (data.entry_history.bank/10).toFixed(1)
				value = (data.entry_history.value/10).toFixed(1)
                let totalBudget = (newPicks.reduce((x,y) => x+(+y.selling_price),0) + +bank).toFixed(1)


                for(let i = eventId+1; i <= 38; i++) {
                    gameweekPicks.push({event:i, newPicks, totalBudget, bank, value})
                    gameweekTransfers.push({event:i, transfers: []})
                }
                setPicks(gameweekPicks)
                setReal(realPicks)
                setTransfers(gameweekTransfers)
                localStorage.removeItem('picks')
                localStorage.setItem('picks', JSON.stringify(gameweekPicks))


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

    }, [managerId, eventId ])

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

    const updateWildcard = (isUsed, eventPlayed) => {
        setChips({
            ...chips, wildcard: {used: isUsed, event: eventPlayed}
        })
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
        chips: chips,
        picks: picks,
        real: real,
        transfers: transfers,
        transferLogic: transferLogic,
        managerHistory: managerHistory,
        managerPicks: managerPicks,
        transferHistory: transferHistory,
        getManagerInfo,
        updateWildcard
    }

    return (
        <BootstrapstaticContext.Provider value={contextValue}>
            {children}
        </BootstrapstaticContext.Provider>
    )
}
export default BootstrapstaticProvider