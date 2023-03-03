import { useContext, useState, useEffect } from "react"
import { getGameweeks } from "../services/timeService"
import { getPicks } from "../services/picksService"
import { loadOpponents, loadPlayerOpponents } from "../services/fixtureService"
import { BootstrapstaticContext } from "../BootstrapstaticContext"
import  SquadPlayer  from './SquadPlayer'
import TransferRows from './TransferRows'
import Loader from "./Loader"
import prevPage from "../static/chevron_left.png"
import nextPage from "../static/chevron_right.png"

function Pitch() {

	const fplElements = useContext(BootstrapstaticContext)
	const events = fplElements.events
	const teams = fplElements.teams
	const fixtures = fplElements.fixtures
	const players = fplElements.players
	const picks = fplElements.picks
	const pickIndex = fplElements.pickIndex
	const transferLogic = fplElements.transferLogic
	const playerPosition = fplElements.playerPosition
	const chips = fplElements.chips
	const eventId = fplElements.eventId
	//const history = fplElements.managerHistory
	const curSize = 1
	const [ curPage, setCurPage ] = useState(1)
	const [ gws, setGws ] = useState(38)
	const gameweeks = getGameweeks(events, curPage, curSize).gameweeks
	const length = getGameweeks(events, curPage, curSize).length
	const countdowns = getGameweeks(events, curPage, curSize).countdowns
	const [ showTransfers, setShowTransfers ] = useState(true)
	const [ showTransfersMade, setShowTransfersMade ] = useState(false)
	const [ showChips, setShowChips ] = useState(false)
	const [ wildcard, setWildcard ] = useState(false)
	const [ bboost, setBboost ] = useState(false)
	const [ tcap, setTcap ] = useState(false)
	const [ freehit, setFreehit ] = useState(false)
	/*const [ disableChips, setDisableChips ] = useState({
		wildcard: false,
		bboost: false,
		freehit: false,
		tcap: false
	})*/

	const pickAndTransfer = () => {
		fplElements.getPickIndex(curPage)
		fplElements.getTransferLogic()
	}

	useEffect(() => {
		pickAndTransfer()
	
	}, [pickAndTransfer])
	
	const forWildcard = (curPage) => {
		if(+chips.wildcard.event < +eventId+curPage) {
			setBboost(false)
			setFreehit(false)
			setTcap(false)
		} else if(+chips.wildcard.event === +eventId+curPage) {
			setBboost(true)
			setFreehit(true)
			setTcap(true)
		}

		
	}
	
	const viewNextPage = () => {
        setCurPage((curPage) => curPage+1)
		forWildcard(curPage)

		/*if(chips.wildcard.used && +chips.wildcard.event === +eventId+curPage) {
			setDisableChips({
				...disableChips,
				freehit: true,
				bboost: true,
				tcap: true
			})
		}*/
    }
    const viewPreviousPage = () => {
        setCurPage((curPage) => curPage-1)
		forWildcard(curPage)
		/*if(chips.wildcard.used && +chips.wildcard.event === +eventId+curPage){
			setDisableChips({
				...disableChips,
				freehit: true,
				bboost: true,
				tcap: true
			})
		}*/
    }

	const showTransfersDiv = () => {
		setShowTransfers(true)
		if(showChips) {
			setShowChips(false) 
		}
	}

	const showPlayersOut = () => {
		setShowTransfersMade(!showTransfersMade)	
	}

	const showChipsDiv = () => {
		setShowChips(true)
		if(showTransfers) {
			setShowTransfers(false) 
		}
		if(showTransfersMade) {
			setShowTransfersMade(false)
		}
	}

	const setWildCard = () => {
		let eventPlayed = chips.wildcard.event === null ? eventId+curPage : null
		let isUsed = !chips.wildcard.used
		fplElements.updateWildcard(isUsed, eventPlayed)
		setFreehit(!freehit)
		setTcap(!tcap)
		setBboost(!bboost)
		/*setDisableChips({
			...disableChips,
			freehit: !disableChips.freehit,
			bboost: !disableChips.bboost,
			tcap: !disableChips.tcap
		})*/
	}
	const setBenchBoost = () => {}
	const setTriple = () => {}
	const setFreeHit = () => {}

	
    
	let pageOneVisible = curPage === 1 ? 'hidden' : 'visible'
	let lastPageVisible = curPage === length ? 'hidden' : 'visible'
	let tabBorder = 'rgba(22, 22, 68, 1.0) 4px solid'

  return (
    <div className="transfers-col">
			<div>
				<div className="details-one">
					<div className="gw-buttonswrapper">
						<div className="gw-buttons">
							<button style={{visibility: pageOneVisible}} onClick={viewPreviousPage} className="btn btn-fpl small prev_next" id="prevGameweek">
								<img src={prevPage} alt="prev_page" />
							</button>
							<div id="deadline">
								{gameweeks.map((gameweek, idx) => {
									return(
									<h4 key={idx} id="gameweekNum" className="large">
										{gameweek}
									</h4>)
								})}
								<div className="large">
									<h4 className="theading">Deadline In:</h4>
									{countdowns.map((countdown, idx) => {
										return (
											<div key={idx} className="ttime small">
												<div>
													<span id="day">{countdown.days}</span>
													<span>Days</span>
												</div>
												<div>
													<span id="hour">{countdown.hours}</span>
													<span>Hrs</span>
												</div>
												<div>
													<span id="minute">{countdown.minutes}</span>
													<span>Mins</span>
												</div>
												<div>
													<span id="second">{countdown.seconds}</span>
													<span>Secs</span>
												</div>
											</div>
											)
										})}
								</div>
							</div>
							<button style={{visibility: lastPageVisible}} onClick={viewNextPage} className="btn btn-fpl small prev_next" id="nextGameweek">
								<img src={nextPage}  alt="next_page" />
							</button>
						</div>
					</div>
					<div className="budgetwrapper">
						<div className="budget">
							<div className="budget-players large">
								<h4 className="large">Player Selection</h4>
								<div><span className="player-num" >{fplElements.playersSelected()}</span>&nbsp;<span>/</span>&nbsp;<span>15</span></div>
							</div>
							<div className="free-transfers large">
								<h4 title="Free Transfers large">FT</h4>
								<span className="transfer-number">{fplElements.freeTransfers()}</span>
							</div>
							<div className="cost-transfers large">
								<h4 title="Transfer Cost large">TC</h4>
								<span className="points-lost">{fplElements.transferCost()}</span>
							</div>
							<div className="remain large">
								<h4 className="large">Remaining Budget</h4>
								{players.length && picks.length && fixtures.length && events.length && 
								<span className="remain-budget">
									{fplElements.getInTheBank()}
								</span>}
							</div>
						</div>
					</div>
					<div className="btn-displayer">
						<div style={{borderBottom: showTransfers && tabBorder}} onClick={showTransfersDiv} id="transfer"  className="tab-item">
							<p className="large">Transfers</p>
						</div>
						<div style={{borderBottom: showChips && tabBorder}}  onClick={showChipsDiv} id="chip" className='tab-item'>
							<p className="large">Chips</p>
						</div>
					</div>
					{showTransfers && <div id="transfer-tab"  className="upper-buttons button-item show">
						<button onClick={showPlayersOut} className="btn btn-block show-fpl btn-fpl small">Transfers</button>
						<button className="btn btn-block reset btn-fpl small">Reset</button>
					</div>}
					{showChips && <div id="chip-tab"  className="chip-buttons button-item">
						<button 
						onClick={setWildCard} 
						disabled={(chips.wildcard.used && +chips.wildcard.event < +eventId+curPage) || 
							wildcard === true ? true : false} 
						style={{opacity: chips.wildcard.used && +chips.wildcard.event < +eventId+curPage && 0.7,
						background: (+chips.wildcard.event) === +eventId+curPage && "rgb(22, 22, 68)",
						color: (+chips.wildcard.event) === +eventId+curPage && 'white'}} 
						className="btn btn-block btn-chip small" id="wcard">
							Wildcard&nbsp;
							{+chips.wildcard.event < +eventId+curPage && chips.wildcard.event !== null ? 'Played' : 
							+chips.wildcard.event === +eventId+curPage ? 'Active' : ''} 
							{chips.wildcard.used && +chips.wildcard.event <= +eventId+curPage &&
								<div className="gw">
								  GW&nbsp;{chips.wildcard.event}
							</div>}
						</button>
						<button onClick={setBenchBoost} 
						disabled={(chips.bboost.used && +chips.bboost.event < +eventId+curPage) || 
							bboost === true ? true : false}  style={{opacity: chips.bboost.used && 0.7}} className="btn btn-block btn-chip small" id="bbench">
							Bench Boost&nbsp;{chips.bboost.event === null ? '' : 'Played'} 
							{chips.bboost.used && 
								<div className="gw">
								  GW&nbsp;{chips.bboost.event}
							</div>}
							</button>
						<button onClick={setTriple} 
						disabled={(chips.tcap.used && +chips.tcap.event < +eventId+curPage) || 
							tcap === true ? true : false} style={{opacity: chips.tcap.used && 0.7}} className="btn btn-block btn-chip small" id="tcap">
							Triple Captain&nbsp;{chips.tcap.event === null ? '' : 'Played'}
							{chips.tcap.used && 
								<div className="gw">
								  GW&nbsp;{chips.tcap.event}
							</div>} 
						</button>
						<button onClick={setFreeHit} disabled={chips.freehit.used && true} style={{opacity: chips.freehit.used && 0.7}} className="btn btn-block btn-chip small" id="fhit">
							Free Hit&nbsp;{chips.freehit.event === null ? '' : 'Played'} 
							{chips.freehit.used && 
								<div className="gw">
								  GW&nbsp;{chips.freehit.event}
							</div>}
						</button>
					</div>}
					{showTransfersMade && <TransferRows />}
					<div className="message small"></div>
				</div>
				<div className="field">
					<div className="pitch">
						<div className="tname-details large">
							<span className="theading">Name</span>
							<h4 className="tname">{fplElements.managerInfo.name}</h4>
						</div>
						<div className="trank-details large">
							<span className="theading">Overall Rank</span>
							<div>
								<h4 className="trank">
									{fplElements.managerInfo.summary_overall_rank}
								</h4>
								<div className="arrow"></div>
							</div>
						</div>
                        {(players.length && picks.length && fixtures.length && events.length) ? 
						<>
						<div className="pitch_row" id="goal"  size="pitch">
							{getPicks(players, picks, curPage, curSize).goalkeeper.map((playerPos, idx)=>{
								let player = players.find(x => x.id === playerPos.element)
								let teamObj = teams.find(x => x.id === player.team)
								let inTemp = fplElements.tempPlayersOut.some(x => x.element === playerPos.element)
								let inplayersIn = fplElements.playersIn[pickIndex-1].arr.some(x => x.element == playerPos.element)
								let newPlayer = inplayersIn ? 'NEW' : ''
								let newPadding = inplayersIn ? 2 : 0
								let playerInClass = inplayersIn ? 'player_in' : ''
								let positionObj = playerPosition.find(x => x.id === player.element_type)
	                            let image = (positionObj.id === 1 && !inTemp) ? `${teamObj.code}_1-66`:
								(positionObj.id >= 1 && !inTemp) ? `${teamObj.code}-66` : `0-66`
								let news = player.chance_of_playing_next_round
								let backgroundColor = news === 0 ? 'darkred' : news === 25 ? 'darkorange' :
											news === 50 ? 'orange' : news === 75 ? 'yellow' : 'rgba(0,0,55,0.9)'
								let color = news === 25 ? 'rgba(0,0,55,0.9)' :
											news === 50 ? 'rgba(0,0,55,0.9)' : news === 75 ? 'rgba(0,0,55,0.9)' :'white'
								const opponents = loadOpponents(fixtures, events, teamObj.id, gws).newTeamAandH
								const playerOpps = loadPlayerOpponents(opponents, curPage).playerFix			
								return	(<SquadPlayer image={image} 
									backgroundColor={backgroundColor}
									color={color}
									playerOpps={playerOpps}
									idx={idx}
									player={player} 
									teams={teams}
									playerPos={playerPos}
									positionObj={positionObj}
									playerInClass={playerInClass}
									newPlayer={newPlayer}
									newPadding={newPadding}
									curPage={curPage}></SquadPlayer>)
							})}
						</div>
                        
                        <div className="pitch_row" id="defend"  size="pitch">
						{getPicks(players, picks, curPage, curSize).defenders.map((playerPos, idx)=>{
								let player = players.find(x => x.id === playerPos.element)
								let teamObj = teams.find(x => x.id === player.team)
								let positionObj = playerPosition.find(x => x.id === player.element_type)
								let inTemp = fplElements.tempPlayersOut.some(x => x.element === playerPos.element)
								let inplayersIn = fplElements.playersIn[pickIndex-1].arr.some(x => x.element == playerPos.element)
								let newPlayer = inplayersIn ? 'NEW' : ''
								let newPadding = inplayersIn ? 2 : 0
								let playerInClass = inplayersIn ? 'player_in' : ''
	                            let image = (positionObj.id === 1 && !inTemp) ? `${teamObj.code}_1-66`:
								(positionObj.id >= 1 && !inTemp) ? `${teamObj.code}-66` : `0-66` 
								let news = player.chance_of_playing_next_round
								let backgroundColor = news === 0 ? 'darkred' : news === 25 ? 'darkorange' :
											news === 50 ? 'orange' : news === 75 ? 'yellow' : 'rgba(0,0,55,0.9)'
								let color = news === 25 ? 'rgba(0,0,55,0.9)' :
											news === 50 ? 'rgba(0,0,55,0.9)' : news === 75 ? 'rgba(0,0,55,0.9)' :'white'
								const opponents = loadOpponents(fixtures, events, teamObj.id, gws).newTeamAandH
								const playerOpps = loadPlayerOpponents(opponents, curPage).playerFix;
								return	(<SquadPlayer image={image} 
										backgroundColor={backgroundColor}
										color={color}
										playerOpps={playerOpps}
										idx={idx}
										player={player} 
										teams={teams}
										playerPos={playerPos}
										positionObj={positionObj}
										playerInClass={playerInClass}
										newPlayer={newPlayer}
										newPadding={newPadding}
										curPage={curPage}></SquadPlayer>)
							})}
						</div>

						<div className="pitch_row" id="mid"   size="pitch">
						{getPicks(players, picks, curPage, curSize).midfielders.map((playerPos, idx)=>{
								let player = players.find(x => x.id === playerPos.element)
								let teamObj = teams.find(x => x.id === player.team)
								let positionObj = playerPosition.find(x => x.id === player.element_type)
								let inTemp = fplElements.tempPlayersOut.some(x => x.element === playerPos.element)
								let inplayersIn = fplElements.playersIn[pickIndex-1].arr.some(x => x.element == playerPos.element)
								let newPlayer = inplayersIn ? 'NEW' : ''
								let newPadding = inplayersIn ? 2 : 0
								let playerInClass = inplayersIn ? 'player_in' : ''
	                            let image = (positionObj.id === 1 && !inTemp) ? `${teamObj.code}_1-66`:
								(positionObj.id >= 1 && !inTemp) ? `${teamObj.code}-66` : `0-66`  
								let news = player.chance_of_playing_next_round
								let backgroundColor = news === 0 ? 'darkred' : news === 25 ? 'darkorange' :
											news === 50 ? 'orange' : news == 75 ? 'yellow' : 'rgba(0,0,55,0.9)'
								let color = news === 25 ? 'rgba(0,0,55,0.9)' :
											news === 50 ? 'rgba(0,0,55,0.9)' : news === 75 ? 'rgba(0,0,55,0.9)' :'white'
								const opponents = loadOpponents(fixtures, events, teamObj.id, gws).newTeamAandH
								const playerOpps = loadPlayerOpponents(opponents, curPage).playerFix;
								return	(<SquadPlayer image={image} 
										backgroundColor={backgroundColor}
										color={color}
										playerOpps={playerOpps}
										idx={idx}
										player={player} 
										teams={teams}
										playerPos={playerPos}
										positionObj={positionObj}
										playerInClass={playerInClass}
										newPlayer={newPlayer}
										newPadding={newPadding}
										curPage={curPage}></SquadPlayer>
										)						})}
						</div>

						<div className="pitch_row" id="forw"   size="pitch">
						{getPicks(players, picks, curPage, curSize).forwards.map((playerPos, idx)=>{
								let player = players.find(x => x.id === playerPos.element)
								let teamObj = teams.find(x => x.id === player.team)
								let positionObj = playerPosition.find(x => x.id === player.element_type)
								let inTemp = fplElements.tempPlayersOut.some(x => x.element === playerPos.element)
								let inplayersIn = fplElements.playersIn[pickIndex-1].arr.some(x => x.element == playerPos.element)
								let newPlayer = inplayersIn ? 'NEW' : ''
								let newPadding = inplayersIn ? 2 : 0
								let playerInClass = inplayersIn ? 'player_in' : ''
	                            let image = (positionObj.id === 1 && !inTemp) ? `${teamObj.code}_1-66`:
								(positionObj.id >= 1 && !inTemp) ? `${teamObj.code}-66` : `0-66` 
								let news = player.chance_of_playing_next_round
								let backgroundColor = news === 0 ? 'darkred' : news === 25 ? 'darkorange' :
											news === 50 ? 'orange' : news === 75 ? 'yellow' : 'rgba(0,0,55,0.9)'
								let color = news === 25 ? 'rgba(0,0,55,0.9)' :
											news === 50 ? 'rgba(0,0,55,0.9)' : news === 75 ? 'rgba(0,0,55,0.9)' :'white'
								const opponents = loadOpponents(fixtures, events, teamObj.id, gws).newTeamAandH
								const playerOpps = loadPlayerOpponents(opponents, curPage).playerFix
								return	(<SquadPlayer image={image} 
									backgroundColor={backgroundColor}
									color={color}
									playerOpps={playerOpps}
									idx={idx}
									player={player} 
									teams={teams}
									playerPos={playerPos}
									positionObj={positionObj}
									playerInClass={playerInClass}
									newPlayer={newPlayer}
									newPadding={newPadding}
									curPage={curPage}></SquadPlayer>)
							})}
						</div>
						</> : <Loader />}
						
					</div>
					{players.length && picks.length && fixtures.length && events.length && 
					<div className="pitch_row bench" id="bench">
					{getPicks(players, picks, curPage, curSize).benched.map((playerPos, idx)=>{
								let player = players.find(x => x.id === playerPos.element)
								let teamObj = teams.find(x => x.id === player.team)
								let positionObj = playerPosition.find(x => x.id === player.element_type)
								let inTemp = fplElements.tempPlayersOut.some(x => x.element === playerPos.element)
								let inplayersIn = fplElements.playersIn[pickIndex-1].arr.some(x => x.element == playerPos.element)
								let newPlayer = inplayersIn ? 'NEW' : ''
								let newPadding = inplayersIn ? 2 : 0
								let playerInClass = inplayersIn ? 'player_in' : ''
	                            let image = (positionObj.id === 1 && !inTemp) ? `${teamObj.code}_1-66`:
								(positionObj.id >= 1 && !inTemp) ? `${teamObj.code}-66` : `0-66` 
								let news = player.chance_of_playing_next_round
								let backgroundColor = news === 0 ? 'darkred' : news === 25 ? 'darkorange' :
											news === 50 ? 'orange' : news === 75 ? 'yellow' : 'rgba(0,0,55,0.9)'
								let color = news === 25 ? 'rgba(0,0,55,0.9)' :
											news === 50 ? 'rgba(0,0,55,0.9)' : news === 75 ? 'rgba(0,0,55,0.9)' :'white'
								const opponents = loadOpponents(fixtures, events, teamObj.id, gws).newTeamAandH
								const playerOpps = loadPlayerOpponents(opponents, curPage).playerFix
								return	(<SquadPlayer image={image} 
									backgroundColor={backgroundColor}
									color={color}
									playerOpps={playerOpps}
									idx={idx}
									player={player} 
									teams={teams}
									playerPos={playerPos}
									playerInClass={playerInClass}
									newPadding={newPadding}
									newPlayer={newPlayer}
									curPage={curPage}></SquadPlayer>)
							})}
					</div>}
				</div>
			</div>
			
		</div>
  )
}

export default Pitch