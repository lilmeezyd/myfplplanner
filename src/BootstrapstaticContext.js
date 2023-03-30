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
    playersOut: [],
    playersIn: [],
    outplayer: {},
    inplayerOne: {},
    inplayerTwo: {},
    tempPlayersOut: [],
    managerId: 0,
    eventId: 1,
    pickIndex: 1,
    playerName: '',
    remainingBudget: null,
    getManagerInfo: () => {},
    updateWildcard: () => {},
    addToTransfersOut: () => {},
    addToTransfersIn: () => {},
    getPickIndex: () => {},
    changeCaptain: () => {},
    changeViceCaptain: () => {},
    getOutPlayer: () => {},
    getInPlayerOne: () => {},
    getInPlayerTwo: () => {},
    cancelPlayer: () => {},
    getInTheBank: () => {},
    switchPlayers: () => {},
    changeBenchOrder: () => {},
    playersSelected: () => {},
    goalkeepersSelected: () => {},
    defendersSelected: () => {},
    midfieldersSelected: () => {},
    forwardsSelected: () => {},
    addedPlayer: () => {},
    getTransferLogic: () => {},
    transferCost: () => {},
    freeTransfers: () => {},
    updateFreehit: () => {},
    updateBboost: () => {},
    updateTcap: () => {},
    actDeact: () =>{},
    colorOfArrow: () => {},
    resetGws: () => {}
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
    const [ eventId, setEventId ] = useState(1)
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
    const [ picks, setPicks ] = useState([])
    //const [ picks, setPicks ] = 
    //useState(+(localStorage.getItem('managerId')) === managerId ? [] : JSON.parse(localStorage.getItem('picks')) )
    const [ real, setReal ] = useState([])
    const [ transfers, setTransfers ] = useState([])
    const [ remainingBudget, setRemainingBudget ] = useState(null)
    const [ playersOut, setPlayersOut ] = useState([])
    const [ playersIn, setPlayersIn ] = useState([])
    const [ tempPlayersOut, setTempPlayersOut ] = useState([])
    const [ outplayer, setOutPlayer ] = useState({})
    const [ inplayerOne, setInPlayerOne ] = useState({})
    const [ inplayerTwo, setInPlayerTwo ] = useState({})
    const [ pickIndex, setPickIndex ] = useState(1)
    const [ playerName, setPlayerName ] = useState('')

  
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
        
                setChips({ 
                    wildcard: {used: wildcard, event: wEvent},
                    bboost: {used: bboost, event: bEvent},
                    freehit: {used: freehit, event: fEvent},
                    tcap: {used: tcap, event: tEvent}})
                
                
                //localStorage.removeItem('chips')
               // localStorage.setItem('chips', JSON.stringify(chips))    
                
                const { current, chips } = data
                let fts = 1
                returnFt(1, current.length, fts)
                //rolledft = fts === 1 ? false : 2
                function returnFt(a, b, c) {
                    if(a === b) {
                        fts = c
                        setTransferLogic({fts:fts,
                            rolledFt: fts === 1 ? false : true
                        })
                        return;
                    }
                    if(current[a].event_transfers === 0 && current[a].event !== chips.filter(x => x.name === 'wildcard')[0]?.event) {
                        c = 2
                    }
                    if(current[a].event_transfers === 0 && current[a].event === chips.filter(x => x.name === 'wildcard')[0]?.event ) {
                        c = 1
                    }
                    if(current[a].event_transfers === 0 && current[a].event === chips.filter(x => x.name === 'freehit')[0]?.event ) {
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
        managerId >= 1 && fetchManagerInfo()
        managerId >= 1 && fetchManagerHistory()
    }, [managerId])
    

    useEffect(() => {
        

        const fetchManagerPicks = async () => {
            const url = `https://corsproxy.io/?https://fantasy.premierleague.com/api/entry/${managerId}/event/${eventId}/picks/`
            const url1 = `https://corsproxy.io/?https://fantasy.premierleague.com/api/entry/${managerId}/transfers/`
            try {
                const response1 = await fetch(url1)
                const data1 = await response1.json()
                setTransferHistory(data1)
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
                const gameweekTransfersOut = []
                const gameweekTransfersIn = []
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
                    //.map(y => y.position > 11 ? y.multiplier = 0 : y.multiplier)
				} else {
					data.picks.map(x => x)
                    //.map(y => y.position > 11 ? y.multiplier = 0 : y.multiplier)
				}

                data.picks.forEach(x => {
					data1.forEach(y => {
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
                    gameweekTransfersOut.push({event:i, arr: []})
                    gameweekTransfersIn.push({event:i, arr: []})
                }
                setPicks(gameweekPicks)
                setReal(realPicks)
                setPlayersOut(gameweekTransfersOut)
                setPlayersIn(gameweekTransfersIn)
                localStorage.removeItem('picks')
                localStorage.setItem('picks', JSON.stringify(gameweekPicks))


            } catch (error) {
                console.log(error)
            } } catch(error) {
                console.log(error)
            }
        }

         managerId >= 1 && fetchManagerPicks()

    }, [managerId, eventId, players])

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
    
    const colorOfArrow = () => {
        if(managerHistory.current){
            let color
            let gwCurrent = managerHistory.current[managerHistory.current.length -1].overall_rank
            let gwPrevious = managerHistory.current[managerHistory.current.length -2].overall_rank
            if(gwCurrent < gwPrevious) {
                color = 'green'
            } else if(gwCurrent > gwPrevious) {
                color = 'red'
            } else {
                color = 'grey'
            }
            return color
        }
    }

    const getManagerInfo = (id) => {
        setManagerId(id)
        setPickIndex(1)
    }

    const getPickIndex = (id) => {
        setPickIndex(id)
        setPlayerName('')
    } 

    const updateWildcard = (isUsed, eventPlayed) => {
        setChips({
            ...chips, wildcard: {used: isUsed, event: eventPlayed}
        })
    }

    const updateFreehit = (isUsed, eventPlayed) => {
        setChips({
            ...chips, freehit: {used: isUsed, event: eventPlayed}
        })
    }

    const resetGws = () => {
        // set playersIn and playersOut
        setPlayersIn(prev => prev.map((gw, idx) => idx >= pickIndex-1 ? 
                {...gw, arr:[]} : gw))
        setPlayersOut(prev => prev.map((gw, idx) => idx >= pickIndex-1 ? 
                {...gw, arr:[]} : gw))
        setTempPlayersOut([])
        setOutPlayer({})
        setInPlayerOne({})
        // set picks for later weeks
        if(pickIndex === 1) {
            setPicks(prev => prev.map((pick, key) => 
                key >= pickIndex-1 ? {...pick, newPicks:real} : pick))
        } else {
            if((chips.freehit.event === picks[pickIndex-2].event) && (pickIndex-2 > 0)){
                console.log('gt 0')
                setPicks(prev => prev.map((pick, key) => 
                    key >= pickIndex-1 ? 
                    {...pick, newPicks:prev[pickIndex-3].newPicks} : pick))
            } else if((chips.freehit.event === picks[pickIndex-2].event) && (pickIndex-2 === 0)) {
                console.log('lt 0')
                setPicks(prev => prev.map((pick, key) => 
                    key >= pickIndex-1 ? {...pick, newPicks:real} : pick))
            } else {
                console.log('normal')
                setPicks(prev => prev.map((pick, key) => 
                key >= pickIndex-1 ? 
                {...pick, newPicks:prev[pickIndex-2].newPicks} : pick))
            }
        }
       
    }
    const actDeact = () => {
        if(chips.freehit.event === (+eventId+pickIndex)) {
            setPlayersIn(prev => prev.map((gw, idx) => idx > pickIndex-1 ? 
                {...gw, arr:[]} : gw))
            setPlayersOut(prev => prev.map((gw, idx) => idx > pickIndex-1 ? 
                {...gw, arr:[]} : gw))
            if(pickIndex === 1) {
                setPicks(prev => prev.map((pick, key) => 
                key > pickIndex-1 ? {...pick, newPicks:real} : pick))
            } else {
                setPicks(prev => prev.map((pick, key) => 
                key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-2].newPicks} : pick))
            }
        } else {
            setPicks(prev => prev.map((pick, key) => 
            key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-1].newPicks} : pick)) 
            setPlayersIn(prev => prev.map((gw, idx) => idx > pickIndex-1 ? 
                {...gw, arr:[]} : gw))
            setPlayersOut(prev => prev.map((gw, idx) => idx > pickIndex-1 ? 
                {...gw, arr:[]} : gw))
        } 
    }

    const updateBboost = (isUsed, eventPlayed) => {
        setChips({
            ...chips, bboost: {used: isUsed, event: eventPlayed}
        })
    }

    const updateTcap = (isUsed, eventPlayed) => {
        setChips({
            ...chips, tcap: {used: isUsed, event: eventPlayed}
        })
    }

    const addToTransfersOut = (player) => {

        
        //Add player to playersOut or remove player from playersOut
        let totalBudget = +picks[pickIndex-1].totalBudget
        let spent = picks[pickIndex-1].newPicks.reduce((x,y) => x+(+y.selling_price),0) - playersOut.reduce((x,y) => x+(+y.selling_price),0) 
        let isFoundOut = playersOut[pickIndex-1].arr.some(x => x.element === player.element)
        let isFoundIn = playersIn[pickIndex-1].arr.some(x => x.element === player.element)
        let sellingPrice = +picks[pickIndex-1].newPicks.find(x => x.element === player.element).selling_price
        let remainder = (+totalBudget-spent).toFixed(1)
        if(isFoundOut) {
            let isFoundOutIndex = playersOut[pickIndex-1].arr.findIndex(x => x.element === player.element)
            let isFoundOutTempIndex = tempPlayersOut.findIndex(x => x.element === player.element)
            setPlayersOut(x => [...x.map((gw, idx) => idx === pickIndex-1 ? 
                {...gw, arr: gw.arr.filter((y, key) => key !==  isFoundOutIndex)} : gw )])
            setTempPlayersOut(x => [...x.filter((y, idx) => idx !== isFoundOutTempIndex)])
            setRemainingBudget(+remainder-sellingPrice)
        } else {
            if(!isFoundIn) {
                setPlayersOut(x => [...x.map((gw, idx) => idx === pickIndex-1 ? 
                    {...gw, arr: [...gw.arr, player]} : gw )])
                setTempPlayersOut(x => [...x, player])}
        }

        if(isFoundIn) {
            //In PlayersIn Array
            let isFoundInIndex = playersIn[pickIndex-1].arr.findIndex(x => x.element === player.element)
            let isFoundInPicksIndex = picks[pickIndex-1].newPicks.findIndex(x => x.element === player.element)
            let replacedElement = playersIn[pickIndex-1].arr[isFoundInIndex].element_out
            const replacedObj = playersOut[pickIndex-1].arr.find(x => x.element === replacedElement)
            //let isCaptain = playersIn[pickIndex-1].arr[isFoundInIndex].is_captain
            //let isViceCaptain = playersIn[pickIndex-1].arr[isFoundInIndex].is_vice_captain
            //let multiplier = playersIn[pickIndex-1].arr[isFoundInIndex].multiplier
            //let position = playersIn[pickIndex-1].arr[isFoundInIndex].position
            let isCaptain = picks[pickIndex-1].newPicks[isFoundInPicksIndex].is_captain
            let isViceCaptain = picks[pickIndex-1].newPicks[isFoundInPicksIndex].is_vice_captain
            let multiplier = picks[pickIndex-1].newPicks[isFoundInPicksIndex].multiplier
            let position = picks[pickIndex-1].newPicks[isFoundInPicksIndex].position
            const replacedElementObj = 
            {...replacedObj, 
                is_captain:isCaptain, 
                is_vice_captain:isViceCaptain,
                multiplier:multiplier,
                position:position
            }
            
            setPlayersIn(x => [...x.map((gw, idx) => idx === pickIndex-1 ? 
                {...gw, arr: gw.arr.filter((y, key) => key !==  isFoundInIndex)} : gw )])
            setPlayersIn(prev => prev.map((gw, idx) => idx > pickIndex-1 ? 
                {...gw, arr:[]} : gw))
            setPlayersOut(prev => prev.map((gw, idx) => idx > pickIndex-1 ? 
                {...gw, arr:[]} : gw))
            setPicks([...picks.map((pick, key) => 
                                key === pickIndex-1 ? {...pick, newPicks: pick.newPicks.map((newPick, idx) =>
                                    idx === isFoundInPicksIndex ? replacedElementObj : newPick )} : pick)])
            if(chips.freehit.event === (+eventId+pickIndex)) {
                if(pickIndex === 1) {
                    setPicks(prev => prev.map((pick, key) => 
                    key > pickIndex-1 ? {...pick, newPicks:real} : pick))
                } else {
                    setPicks(prev => prev.map((pick, key) => 
                    key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-2].newPicks} : pick))
                }
            } else {
                setPicks(prev => prev.map((pick, key) => 
                key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-1].newPicks} : pick)) 
            }
            
            //In PlayersOut Array
			let	isFoundOutIndex = playersOut.findIndex(x => x.element === player.element)
            let isFoundOutTempIndex = tempPlayersOut.findIndex(x => x.element === player.element)
            setPlayersOut(x => [...x.map((gw, idx) => idx === pickIndex-1 ? 
                {...gw, arr: gw.arr.filter((y, key) => key !==  isFoundOutIndex)} : gw )])
            setTempPlayersOut(x => [...x, replacedElementObj])
        }
        
    }
    const addToTransfersIn = (id, elementType, teamId) => {
        const player = {}
        let playersOutG = tempPlayersOut.filter(x => x.element_type === 1).length
        let playersOutD = tempPlayersOut.filter(x => x.element_type === 2).length
        let playersOutM = tempPlayersOut.filter(x => x.element_type === 3).length
        let playersOutF = tempPlayersOut.filter(x => x.element_type === 4).length

        let goalkeepers = picks[pickIndex-1].newPicks.filter(x => x.element_type === 1).length - playersOutG
        let defenders = picks[pickIndex-1].newPicks.filter(x => x.element_type === 2).length - playersOutD
        let midfielders = picks[pickIndex-1].newPicks.filter(x => x.element_type === 3).length - playersOutM
        let forwards = picks[pickIndex-1].newPicks.filter(x => x.element_type === 4).length - playersOutF

        let playersOutCap = tempPlayersOut.some(x => x.is_captain)
        let playersOutvCap = tempPlayersOut.some(x => x.is_vice_captain)

        let isCaptain = picks[pickIndex-1].newPicks.some(x => x.is_captain)
        let isViceCaptain = picks[pickIndex-1].newPicks.some(x => x.is_vice_captain)

        
        //let price_change = (players.find(x => x.id === id).price_change/10).toFixed(1)
        let element_in_cost = (players.find(x => x.id === id).now_cost/10).toFixed(1)
        let selling_price = (players.find(x => x.id === id).now_cost/10).toFixed(1)

        player.element_type = elementType
        player.element = id
        player.team = teamId
        player.disabled = true
        player.position = 0
        player.multiplier = 1
        //player.price_change = price_change
        player.element_in_cost = element_in_cost
        player.selling_price = selling_price

        let playersOutBenchG = tempPlayersOut.filter(x => x.multiplier === 0 && x.element_type === 1).length
        let playersOutnonB = tempPlayersOut.filter(x => x.multiplier !== 0).length
        let playersOutPG =  tempPlayersOut.filter(x => x.multiplier !== 0 && x.element_type === 1).length
        let playersOutPD = tempPlayersOut.filter(x => x.multiplier !== 0 && x.element_type === 2).length
        let playersOutPM = tempPlayersOut.filter(x => x.multiplier !== 0 && x.element_type === 3).length
        let playersOutPF = tempPlayersOut.filter(x => x.multiplier !==0 && x.element_type === 4).length

        let benchGoalie = picks[pickIndex-1].newPicks.filter(x => x.multiplier === 0 && x.element_type === 1).length - playersOutBenchG
        let	nonBench = picks[pickIndex-1].newPicks.filter(x => x.multiplier !== 0).length - playersOutnonB
        let playingGoalie = picks[pickIndex-1].newPicks.filter(x => x.multiplier !== 0 && x.element_type === 1).length - playersOutPG
        let playingDef = picks[pickIndex-1].newPicks.filter(x => x.multiplier !== 0 && x.element_type === 2).length - playersOutPD
        let playingMid = picks[pickIndex-1].newPicks.filter(x => x.multiplier !== 0 && x.element_type === 3).length - playersOutPM
        let playingFwd = picks[pickIndex-1].newPicks.filter(x => x.multiplier !==0 && x.element_type === 4).length - playersOutPF

        let num = elementType === 1 ? 2 : elementType === 2 ? 5 : 
					elementType === 3 ? 5 : 3
		let fieldnum = elementType === 1 ? 'Goalkeepers' : 
					elementType === 2 ?	'Defenders' : elementType === 3 ? 'Midfielder' : 'Forwards'	

        
        if(picks[pickIndex-1].newPicks.length < 15 || tempPlayersOut.length > 0) {
            let orderOne = picks[pickIndex-1].newPicks.some(x => x.position === 13)
            let orderTwo = picks[pickIndex-1].newPicks.some(x => x.position === 14)
            let orderThree = picks[pickIndex-1].newPicks.some(x => x.position === 15)

            if(elementType === 1 && playingGoalie === 1) {
                player.position = 12
                player.multiplier = 0
            } else {
                player.position = 1
                player.multiplier = 1
            }

            if((elementType === 2 && nonBench === 11) ||
                (elementType === 2 && nonBench === 9 && playingDef === 4 && playingMid === 5) || 
                (elementType === 2 && nonBench === 10 && playingGoalie === 0)||
                (elementType === 2 && nonBench === 10 && playingFwd === 0)) {
                player.multiplier = 0
                player.position = (!orderOne && !orderTwo && !orderThree) ? 13 :
                (orderOne && !orderTwo && !orderThree) ? 14 : 
                (orderOne && orderTwo && !orderThree) ? 15 :
                (!orderOne && orderTwo && orderThree) ? 13 :
                (orderOne && !orderTwo && orderThree) ? 14 : 15 
            }

            if((elementType === 3 && nonBench === 11) ||
                (elementType === 3 && nonBench === 9 && playingMid === 4 && playingDef === 5) || 
                (elementType === 3 && nonBench === 10 && playingGoalie === 0)||
                (elementType === 3 && nonBench === 10 && playingFwd === 0) ||
                (elementType === 3 && nonBench === 10 && playingDef === 2)) {
                player.multiplier = 0
                player.position = (!orderOne && !orderTwo && !orderThree) ? 13 :
                (orderOne && !orderTwo && !orderThree) ? 14 : 
                (orderOne && orderTwo && !orderThree) ? 15 :
                (!orderOne && orderTwo && orderThree) ? 13 :
                (orderOne && !orderTwo && orderThree) ? 14 : 15
            }

            if((elementType === 4 && nonBench === 11) ||
                (elementType === 4 && nonBench === 10 && playingGoalie === 0)||
                (elementType === 4 && nonBench === 10 && playingDef === 2)) {
                player.multiplier = 0
                player.position = (!orderOne && !orderTwo && !orderThree) ? 13 :
                (orderOne && !orderTwo && !orderThree) ? 14 : 
                (orderOne && orderTwo && !orderThree) ? 15 :
                (!orderOne && orderTwo && orderThree) ? 13 :
                (orderOne && !orderTwo && orderThree) ? 14 : 15
            }
            if((elementType === 1 && goalkeepers < 2) ||
                (elementType === 2 && defenders < 5) || 
                (elementType === 3 && midfielders < 5) ||
                (elementType === 4 && forwards < 3)) {
                    let repeatedPlayer = []
                    let playerOut = tempPlayersOut.find(x => x.element_type === player.element_type)
                    let playerOutIndex = picks[pickIndex-1].newPicks.findIndex(x => x.element === playerOut.element)
                    //switching captaincy
                    player.is_captain = playerOut.is_captain
                    player.is_vice_captain = playerOut.is_vice_captain
                    player.multiplier = playerOut.multiplier
                    player.element_out = playerOut.element
                    player.position = playerOut.position
                    //x.setAttribute('disabled', true)
                    for(let j = 0; j < playersOut[pickIndex-1].arr.length; j++) {
                        if(player.element === playersOut[pickIndex-1].arr[j].element) {
                            repeatedPlayer.push(...playersOut[pickIndex-1].arr.splice(j,1))
                        }
                    }
                    if(repeatedPlayer.length === 1) { 
                        // player already transferred out
                        playersIn.push()
                        let likelyReplaced = tempPlayersOut.find(x => x.element_type === player.element_type)
                        let isOut =  picks[pickIndex-1].newPicks.some(x => x.element_out === repeatedPlayer[0].element)
                        if(isOut) {
                            let withIsOut = picks[pickIndex-1].newPicks.find(x => x.element_out === repeatedPlayer[0].element)
                            withIsOut.element_out = likelyReplaced.element
                            let inIndex = playersIn[pickIndex-1].arr.findIndex(x => x.element === withIsOut.element)
                            setPlayersIn(x => [...x.map((gw, idx) => idx === pickIndex-1 ? 
                                {...gw, arr: [...gw.arr.filter((y, key) => key !==  inIndex), withIsOut]} : gw )])
                            repeatedPlayer[0].is_captain = likelyReplaced.is_captain
                            repeatedPlayer[0].is_vice_captain = likelyReplaced.is_vice_captain
                            repeatedPlayer[0].position = likelyReplaced.position
                            repeatedPlayer[0].multiplier = likelyReplaced.multiplier
                            let repeatedIndex = picks[pickIndex-1].newPicks.findIndex(x=>x.element===likelyReplaced.element)
                            setPicks([...picks.map((pick, key) => 
                                key === pickIndex-1 ? {...pick, newPicks: pick.newPicks.map((newPick, idx) =>
                                    idx === repeatedIndex ? repeatedPlayer[0] : newPick )} : pick)])

                            // set picks for later weeks
                            if(chips.freehit.event === (+eventId+pickIndex)) {
                                if(pickIndex === 1) {
                                    setPicks(prev => prev.map((pick, key) => 
                                    key > pickIndex-1 ? {...pick, newPicks:real} : pick))
                                } else {
                                    setPicks(prev => prev.map((pick, key) => 
                                    key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-2].newPicks} : pick))
                                }
                            } else {
                                setPicks(prev => prev.map((pick, key) => 
                                key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-1].newPicks} : pick)) 
                            }

                        } else {
                            setPicks([...picks.map((pick, key) => 
                                key === pickIndex-1 ? {...pick, newPicks: pick.newPicks.map((newPick, idx) =>
                                    newPick.element === repeatedPlayer[0].element ? repeatedPlayer[0] : newPick )} : pick)])
                            // set picks for later weeks
                            if(chips.freehit.event === (+eventId+pickIndex)) {
                                if(pickIndex === 1) {
                                    setPicks(prev => prev.map((pick, key) => 
                                    key > pickIndex-1 ? {...pick, newPicks:real} : pick))
                                } else {
                                    setPicks(prev => prev.map((pick, key) => 
                                    key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-2].newPicks} : pick))
                                }
                            } else {
                                setPicks(prev => prev.map((pick, key) => 
                                key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-1].newPicks} : pick)) 
                            } 
                            
                        }
                        let pIndex = tempPlayersOut.findIndex(x => x.element_type === player.element_type && x.element === likelyReplaced.element)
                        
                        setTempPlayersOut(x => [...x.filter((y, idx) => idx !== pIndex)])
                    }
                    else { // Normal player addition

                        // set playersIn array
                        setPlayersIn(x => [...x.map((gw, idx) => idx === pickIndex-1 ? 
                            {...gw, arr: [...gw.arr, player]} : 
                            idx > pickIndex-1 ? {...gw, arr:[]} : gw )])
                        // set playersOut array
                        setPlayersOut(x => [...x.map((gw, idx) => idx > pickIndex-1 ?
                            {...gw, arr:[]} : gw)])    
                        
                        // set picks in current week
                        setPicks([...picks.map((pick, key) => 
                                key === pickIndex-1 ? {...pick, newPicks: pick.newPicks.map((newPick, idx) =>
                                    idx === playerOutIndex ? player : newPick )} : pick)])
                        let pIndex = tempPlayersOut.findIndex(x => x.element_type === player.element_type)
                        setTempPlayersOut(x => [...x.filter((y, idx) => idx !== pIndex)])

                        // set picks for later weeks
                        if(chips.freehit.event === (+eventId+pickIndex)) {
                            if(pickIndex === 1) {
                                setPicks(prev => prev.map((pick, key) => 
                                key > pickIndex-1 ? {...pick, newPicks:real} : pick))
                            } else {
                                setPicks(prev => prev.map((pick, key) => 
                                key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-2].newPicks} : pick))
                            }
                        } else {
                            setPicks(prev => prev.map((pick, key) => 
                            key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-1].newPicks} : pick)) 
                        }
                           
                    }
                
                }
        }

    }

    const changeCaptain = (id) => {
        const old = picks[pickIndex-1].newPicks.find(x => x.is_captain)
        const player = picks[pickIndex-1].newPicks.find(x => x.element === id)
        let oldCap = false
        let oldMultiplier = 1
        let oldVc = player.is_vice_captain === true ? true : false 
        let playerCap = true
        let playerMultiplier = 2
        let playerVc = false
        setPicks(picks.map((pick, key) => 
            key === pickIndex-1 ? {...pick, newPicks: pick.newPicks.map((newPick) =>
                newPick.element === old.element ? 
                {...newPick, is_captain:oldCap, is_vice_captain:oldVc,
                multiplier:oldMultiplier} :
                newPick.element === player.element ? 
                {...newPick, is_captain:playerCap, is_vice_captain:playerVc,
                multiplier:playerMultiplier} : newPick )} : pick))

        // set picks for later weeks
        if(chips.freehit.event === (+eventId+pickIndex)) {
            if(pickIndex === 1) {
                setPicks(prev => prev.map((pick, key) => 
                key > pickIndex-1 ? {...pick, newPicks:real} : pick))
            } else {
                setPicks(prev => prev.map((pick, key) => 
                key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-2].newPicks} : pick))
            }
        } else {
            setPicks(prev => prev.map((pick, key) => 
            key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-1].newPicks} : pick)) 
        }    
    }
    const changeViceCaptain = (id) => {
        const old = picks[pickIndex-1].newPicks.find(x => x.is_vice_captain)
		const player = picks[pickIndex-1].newPicks.find(x => x.element === id)
        let oldVc = false
        let oldMultiplier = player.multiplier >= 2 ? 2 : 1 
        let oldCap = player.is_captain === true ? true : false
        let playerCap = false
        let playerVc = true
        setPicks([...picks.map((pick, key) => 
            key === pickIndex-1 ? {...pick, newPicks: pick.newPicks.map((newPick) =>
                newPick.element === old.element ? 
                {...newPick, is_captain:oldCap, is_vice_captain:oldVc,
                multiplier:oldMultiplier} :
                newPick.element === player.element ? 
                {...newPick, is_captain:playerCap, is_vice_captain:playerVc,
                multiplier: 1} : newPick )} : pick)])
        // set picks for later weeks
        if(chips.freehit.event === (+eventId+pickIndex)) {
            if(pickIndex === 1) {
                setPicks(prev => prev.map((pick, key) => 
                key > pickIndex-1 ? {...pick, newPicks:real} : pick))
            } else {
                setPicks(prev => prev.map((pick, key) => 
                key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-2].newPicks} : pick))
            }
        } else {
            setPicks(prev => prev.map((pick, key) => 
            key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-1].newPicks} : pick)) 
        }   
    }
    
    const getOutPlayer = (outplayer) => {
        setOutPlayer(outplayer)
    }
    const getInPlayerOne = (inplayerOne) => {
        setInPlayerOne(inplayerOne)
    }
    const getInPlayerTwo = (inplayerTwo) => {
        setInPlayerTwo(inplayerTwo)
    }
    const switchPlayers = () => {
        setPicks([...picks.map((pick, key) => 
            key === pickIndex-1 ? {...pick, newPicks: pick.newPicks.map((newPick) =>
                newPick.element === outplayer.element ? 
                {...newPick, is_captain:false, is_vice_captain:false,
                multiplier:0, position:inplayerOne.position} :
                newPick.element === inplayerOne.element ? 
                {...newPick, is_captain:outplayer.is_captain,
                is_vice_captain:outplayer.is_vice_captain,
                multiplier: outplayer.multiplier,
                position: outplayer.position} : newPick )} : pick)])

        // set picks for later weeks
        if(chips.freehit.event === (+eventId+pickIndex)) {
            if(pickIndex === 1) {
                setPicks(prev => prev.map((pick, key) => 
                key > pickIndex-1 ? {...pick, newPicks:real} : pick))
            } else {
                setPicks(prev => prev.map((pick, key) => 
                key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-2].newPicks} : pick))
            }
        } else {
            setPicks(prev => prev.map((pick, key) => 
            key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-1].newPicks} : pick)) 
        }   
        
        setOutPlayer({})
        setInPlayerOne({})
    }
    const changeBenchOrder = () => {
        setPicks([...picks.map((pick, key) => 
            key === pickIndex-1 ? {...pick, newPicks: pick.newPicks.map((newPick) =>
                newPick.element === inplayerOne.element ? 
                {...newPick, position:inplayerTwo.position} :
                newPick.element === inplayerTwo.element ? 
                {...newPick,position:inplayerOne.position} : newPick )} : pick)])
        
        // set picks for later weeks
        if(chips.freehit.event === (+eventId+pickIndex)) {
            if(pickIndex === 1) {
                setPicks(prev => prev.map((pick, key) => 
                key > pickIndex-1 ? {...pick, newPicks:real} : pick))
            } else {
                setPicks(prev => prev.map((pick, key) => 
                key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-2].newPicks} : pick))
            }
        } else {
            setPicks(prev => prev.map((pick, key) => 
            key > pickIndex-1 ? {...pick, newPicks:prev[pickIndex-1].newPicks} : pick)) 
        }   
        setInPlayerOne({})
        setInPlayerTwo({})
    }
    const cancelPlayer = (player) => {
        player.multiplier === 0 ? setInPlayerOne({}) : setOutPlayer({})
    }
    const getInTheBank = () => {
        let totalBudget = +picks[pickIndex-1].totalBudget
        let spent = picks[pickIndex-1].newPicks.reduce((x,y) => x+(+y.selling_price),0)-
        tempPlayersOut.reduce((x,y) => x+(+y.selling_price),0)
        let inBank = (totalBudget-spent).toFixed(1)
        return inBank
    }

    const playersSelected = () => {
        if(picks.length) {
            let firstXV = picks[pickIndex-1].newPicks.length - tempPlayersOut.length
            return firstXV
        }
    }

    const goalkeepersSelected = () => {
        if(picks.length) {
            let goalies = picks[pickIndex-1].newPicks
                            .filter(x => x.element_type === 1).length - tempPlayersOut.filter(x => x.element_type === 1).length
            return goalies
        }
    }
    const defendersSelected = () => {
        if(picks.length) {
            let defenders = picks[pickIndex-1].newPicks
                            .filter(x => x.element_type === 2).length - tempPlayersOut.filter(x => x.element_type === 2).length
            return defenders
        }
    }
    const midfieldersSelected = () => {
        if(picks.length) {
            let mids = picks[pickIndex-1].newPicks
                            .filter(x => x.element_type === 3).length - tempPlayersOut.filter(x => x.element_type === 3).length
            return mids
        }
    }
    const forwardsSelected = () => {
        if(picks.length) {
            let forwards = picks[pickIndex-1].newPicks
                            .filter(x => x.element_type === 4).length - tempPlayersOut.filter(x => x.element_type === 4).length
            return forwards
        }
    }

    const addedPlayer = (team, player) => {
        let playerName = players.find(x => x.id === player).web_name
        setPlayerName(playerName)
    }

    const getTransferLogic = () => {
        let fts = transferLogic.fts
        let current = playersOut[pickIndex-2]
        console.log(fts)
        console.log(current)
        /*returnFt(1, current.length, fts)
        function returnFt(a, b, c) {
                    if(a === b) {
                        fts = c
                        setTransferLogic({fts:fts,
                            rolledFt: fts === 1 ? false : true
                        })
                        return;
                    }
                    if(current[a].event_transfers === 0 && current[a].event !== chips.filter(x => x.name === 'wildcard')[0]?.event) {
                        c = 2
                    }
                    if(current[a].event_transfers === 0 && current[a].event === chips.filter(x => x.name === 'wildcard')[0]?.event ) {
                        c = 1
                    }
                    if(current[a].event_transfers === 0 && current[a].event === chips.filter(x => x.name === 'freehit')[0]?.event ) {
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
                } */
    } 

    const freeTransfers = () => {
        let fts
        if(pickIndex > 1) {
            playersOut[pickIndex-2].arr.length === 0 && 
            chips.freehit.event !== (+eventId+pickIndex-1) &&
            chips.wildcard.event !== (+eventId+pickIndex-1) && (fts=2)

            playersOut[pickIndex-2].arr.length === 0 && 
            (chips.freehit.event === (+eventId+pickIndex-1) ||
            chips.wildcard.event === (+eventId+pickIndex-1)) && (fts=1)
            
            playersOut[pickIndex-2].arr.length > 1 && (fts=1)
            playersOut[pickIndex-2].arr.length === 1 && transferLogic.rolledFt && (fts=2)
            playersOut[pickIndex-2].arr.length === 1 && !transferLogic.rolledFt && (fts=1)
        } else {
            fts = transferLogic.fts 
        }
        return fts
    }

    const transferCost = () => {
        let fts = 
        (chips.freehit.event === (+eventId+pickIndex) || chips.wildcard.event === (+eventId+pickIndex)) ? 1e10000 : freeTransfers()
        let playerLength = playersOut[pickIndex-1]?.arr.length === undefined ? 0 :
                            playersOut[pickIndex-1]?.arr.length
        let cost = playerLength <= fts ? 0 : (fts-playerLength)*4
        return cost
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
        playersOut: playersOut,
        playersIn: playersIn,
        tempPlayersOut: tempPlayersOut,
        outplayer: outplayer,
        inplayerOne: inplayerOne,
        inplayerTwo: inplayerTwo,
        transferLogic: transferLogic,
        managerHistory: managerHistory,
        managerPicks: managerPicks,
        transferHistory: transferHistory,
        remainingBudget: remainingBudget,
        pickIndex: pickIndex,
        playerName: playerName,
        getManagerInfo,
        updateWildcard,
        addToTransfersIn,
        addToTransfersOut,
        getPickIndex,
        changeCaptain,
        changeViceCaptain,
        getInPlayerOne,
        getInPlayerTwo,
        getOutPlayer,
        cancelPlayer,
        getInTheBank,
        switchPlayers,
        changeBenchOrder,
        playersSelected,
        goalkeepersSelected,
        defendersSelected,
        midfieldersSelected,
        forwardsSelected,
        addedPlayer,
        getTransferLogic,
        transferCost,
        freeTransfers,
        updateFreehit,
        updateBboost,
        updateTcap,
        actDeact,
        colorOfArrow,
        resetGws
    }

    return (
        <BootstrapstaticContext.Provider value={contextValue}>
            {children}
        </BootstrapstaticContext.Provider>
    )
}
export default BootstrapstaticProvider