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

function Pitch(props) {

	const fplElements = useContext(BootstrapstaticContext)
	const events = fplElements.events
	const teams = fplElements.teams
	const fixtures = fplElements.fixtures
	const players = fplElements.players
	const picks = fplElements.picks
	const pickIndex = fplElements.pickIndex
    const playersSelected = fplElements.playersSelected()
	const outplayer = fplElements.outplayer
	const inplayerOne = fplElements.inplayerOne
	const playerPosition = fplElements.playerPosition
	const chips = fplElements.chips
	const eventId = fplElements.eventId
	const freehit = fplElements.chips.freehit
	const {actDeact} = fplElements
	const curSize = 1
	const [ curPage, setCurPage ] = useState(1)
	const [ gws, setGws ] = useState(38)
	const gameweeks = getGameweeks(events, curPage, curSize).gameweeks
	const length = getGameweeks(events, curPage, curSize).length
	const countdowns = getGameweeks(events, curPage, curSize).countdowns
	const { getPickIndex } = fplElements
	const [ showTransfers, setShowTransfers ] = useState(true)
	const [ showTransfersMade, setShowTransfersMade ] = useState(false)
	const [ showChips, setShowChips ] = useState(false)
	const {handleShow, handleClose, showPop} = props

	useEffect(() => {
		getPickIndex(curPage)
	}, [curPage])

	useEffect(() => {
		let prevBtn = document.getElementById('prevGameweek')
		let nextBtn = document.getElementById('nextGameweek')
		let outKeys = Object.keys(outplayer).length
		let inKeys = Object.keys(inplayerOne).length
		if(playersSelected === 15 || outKeys < 0 || inKeys < 0) {
			nextBtn.removeAttribute('disabled')
			prevBtn.removeAttribute('disabled')
		}
		if(playersSelected < 15 || outKeys > 0 || inKeys > 0) {
			nextBtn.setAttribute('disabled', true)
			prevBtn.setAttribute('disabled', true)
		}
	},[playersSelected, outplayer, inplayerOne]) 

	useEffect(() => {
		const chipsObj =  {
							wcard: 'wildcard',
							fhit: 'freehit',
							tcap: 'tcap',
							bbench: 'bboost'
						}
		let chipsBtn = document.querySelectorAll('.btn-chip')
		const disableOtherChips = (id) => {
			const a = Array.from(chipsBtn)
				.filter(x => x.id !== id && !x.innerText.includes('Played'))
				console.log(a)
				a.forEach(x => x.setAttribute('disabled', true))
		}
		const enableOtherChips = (id) => {
			const a = Array.from(chipsBtn)
				.filter(x => x.id !== id && !x.innerText.includes('Played'))
				console.log(a)
				a.forEach(x => x.removeAttribute('disabled'))
		}
		Array.from(chipsBtn).forEach(btn => {
			btn.innerText.endsWith('Active') ? 
			disableOtherChips(btn.id) :	enableOtherChips(btn.id)
			//btn.innerText.endsWith('Active') && console.log(btn.id)
		})
		Array.from(chipsBtn).forEach(btn => {
			btn.onclick = function() {
				if(btn.innerText.endsWith('Active')) {
					 enableOtherChips(btn.id) 
				} else {
					disableOtherChips(btn.id)
				}
			}
		})
	})



	useEffect(() => {
		let bench = document.getElementById('bench')
		if(chips.bboost.used && chips.bboost.event === (+eventId+curPage)) {
			 bench.classList.add('bench_boost')
		} else {
			bench?.classList.remove('bench_boost')
		}
	}, [chips, eventId, curPage])

	useEffect(() => {
		actDeact()
	}, [freehit])

		
		
	const viewNextPage = () => {
        setCurPage(v => v+1)
    }
    const viewPreviousPage = () => {
        setCurPage(v => v-1)
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

	const setWildCard = (x) => {
		let eventPlayed = chips.wildcard.event === x ? null : 
						  chips.wildcard.event === null ? x : +eventId+curPage
		let isUsed = chips.wildcard.event === x ? false : true
		fplElements.updateWildcard(isUsed, eventPlayed)
	}
	const setBenchBoost = (x) => {
		let eventPlayed = chips.bboost.event === x ? null : 
						  chips.bboost.event === null ? x : +eventId+curPage
		let isUsed = chips.bboost.event === x ? false : true
		fplElements.updateBboost(isUsed, eventPlayed)
	}
	const setTriple = (x) => {
		let eventPlayed = chips.tcap.event === x ? null : 
						  chips.tcap.event === null ? x : +eventId+curPage
		let isUsed = chips.tcap.event === x ? false : true
		fplElements.updateTcap(isUsed, eventPlayed)
	}
	const setFreeHit = (x) => {
		let eventPlayed = chips.freehit.event === x ? null : 
						  chips.freehit.event === null ? x : +eventId+curPage
		let isUsed = chips.freehit.event === x ? false : true
		fplElements.updateFreehit(isUsed, eventPlayed)
	}
	const resetGW = () => {
		fplElements.resetGws()
	}

	
    
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
									<h4 className="theading">Deadline:</h4>
									{countdowns.map((countdown, idx) => {
										return (
											<div key={idx} className="ttime small">
												<span>{new Date(countdown).toDateString()},</span>
												<span>{new Date(countdown).toLocaleTimeString().slice(0,5)}</span>
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
								<span className="transfer-number">
									{(chips.freehit.event === (+eventId+pickIndex) || chips.wildcard.event === (+eventId+pickIndex)) ? 
									'∞' : fplElements.freeTransfers()}</span>
							</div>
							<div className="cost-transfers large">
								<h4 title="Transfer Cost large">TC</h4>
								<span className="points-lost">{fplElements.transferCost()}</span>
							</div>
							<div className="remain large">
								<h4 className="large">Bank</h4>
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
						<button onClick={resetGW} className="btn btn-block reset btn-fpl small">Reset</button>
					</div>}
					{showChips && <div id="chip-tab"  className="chip-buttons button-item">
					<button onClick={() => setWildCard(+eventId+curPage)} 
						disabled={chips.wildcard.used && +chips.wildcard.event < +eventId+curPage && true}	
						style={{opacity: chips.wildcard.used && +chips.wildcard.event < +eventId+curPage && 0.7,
							background: (+chips.wildcard.event) === +eventId+curPage && "rgb(22, 22, 68)",
							color: (+chips.wildcard.event) === +eventId+curPage && 'white'}} className="btn btn-block btn-chip small" id="wcard">
					  Wildcard&nbsp;
					  {+chips.wildcard.event < +eventId+curPage && chips.wildcard.event !== null ? 'Played' : 
					  +chips.wildcard.event === +eventId+curPage ? 'Active' : ''} 
					  {chips.wildcard.used && +chips.wildcard.event < +eventId+curPage &&
						  <div className="gw">
							GW&nbsp;{chips.wildcard.event}
					  </div>}
							</button>
						<button onClick={() => setBenchBoost(+eventId+curPage)} 
						disabled={chips.bboost.used && +chips.bboost.event < +eventId+curPage && true}	
						style={{opacity: chips.bboost.used && +chips.bboost.event < +eventId+curPage && 0.7,
							background: (+chips.bboost.event) === +eventId+curPage && "rgb(22, 22, 68)",
							color: (+chips.bboost.event) === +eventId+curPage && 'white'}} className="btn btn-block btn-chip small" id="bbench">
					  Bench Boost&nbsp;
					  {+chips.bboost.event < +eventId+curPage && chips.bboost.event !== null ? 'Played' : 
					  +chips.bboost.event === +eventId+curPage ? 'Active' : ''} 
					  {chips.bboost.used && +chips.bboost.event < +eventId+curPage &&
						  <div className="gw">
							GW&nbsp;{chips.bboost.event}
					  </div>}
							</button>
						<button onClick={() => setTriple(+eventId+curPage)} 
						disabled={chips.tcap.used && +chips.tcap.event < +eventId+curPage && true}	
						style={{opacity: chips.tcap.used && +chips.tcap.event < +eventId+curPage && 0.7,
							background: (+chips.tcap.event) === +eventId+curPage && "rgb(22, 22, 68)",
							color: (+chips.tcap.event) === +eventId+curPage && 'white'}} className="btn btn-block btn-chip small" id="tcap">
					 	 Triple Captain&nbsp;
					  {+chips.tcap.event < +eventId+curPage && chips.tcap.event !== null ? 'Played' : 
					  +chips.tcap.event === +eventId+curPage ? 'Active' : ''} 
					  {chips.tcap.used && +chips.tcap.event < +eventId+curPage &&
						  <div className="gw">
							GW&nbsp;{chips.tcap.event}
					  </div>}
						</button>
						<button onClick={() => setFreeHit(+eventId+curPage)}
							disabled={chips.freehit.used && +chips.freehit.event < +eventId+curPage && true}	
						  	style={{opacity: chips.freehit.used && +chips.freehit.event < +eventId+curPage && 0.7,
								background: (+chips.freehit.event) === +eventId+curPage && "rgb(22, 22, 68)",
								color: (+chips.freehit.event) === +eventId+curPage && 'white'}} className="btn btn-block btn-chip small" id="fhit">
							Free Hit&nbsp;
							{+chips.freehit.event < +eventId+curPage && chips.freehit.event !== null ? 'Played' : 
							+chips.freehit.event === +eventId+curPage ? 'Active' : ''} 
							{chips.freehit.used && +chips.freehit.event < +eventId+curPage &&
								<div className="gw">
								  GW&nbsp;{chips.freehit.event}
							</div>}
						</button>
					</div>}
					{showTransfersMade && <TransferRows />}
					{fplElements.playerName && 
					<div className={`message small ${fplElements.playerName && 'success'}`}>
						<span>{fplElements.playerName} has been added tp your squad</span>
					</div>}
				</div>
				<div className="field">
					<div className="pitch">
                        {(players.length && picks.length && fixtures.length && events.length) ? 
						<>
						<div className="pitch_row" id="goal" width="pitch">
							{getPicks(players, picks, curPage, curSize).goalkeeper.map((playerPos, idx)=>{
								let player = players.find(x => x.id === playerPos.element)
								let teamObj = teams.find(x => x.id === player.team)
								let inTemp = fplElements.tempPlayersOut.some(x => x.element === playerPos.element)
								let inplayersIn = fplElements.playersIn[pickIndex-1].arr.some(x => x.element === playerPos.element)
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
									curPage={curPage}
									handleShow={handleShow}
									handleClose={handleClose}
									showPop={showPop}></SquadPlayer>)
							})}
						</div>
                        
                        <div className="pitch_row" id="defend" width="pitch">
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
										curPage={curPage}
										handleShow={handleShow}
										handleClose={handleClose}
										showPop={showPop}></SquadPlayer>)
							})}
						</div>

						<div className="pitch_row" id="mid" width="pitch">
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
										curPage={curPage}
										handleShow={handleShow}
										handleClose={handleClose}
										showPop={showPop}></SquadPlayer>
										)						})}
						</div>

						<div className="pitch_row" id="forw" width="pitch">
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
									curPage={curPage}
									handleShow={handleShow}
									handleClose={handleClose}
									showPop={showPop}></SquadPlayer>)
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
									positionObj={positionObj}
									playerInClass={playerInClass}
									newPadding={newPadding}
									newPlayer={newPlayer}
									curPage={curPage}
									handleShow={handleShow}
									handleClose={handleClose}
									showPop={showPop}></SquadPlayer>)
							})}
					</div>}
				</div>
			</div>
			
		</div>
  )
}

export default Pitch