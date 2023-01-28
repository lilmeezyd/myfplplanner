import { useContext, useState } from "react"
import { getGameweeks } from "../services/timeService"
import { getPicks } from "../services/picksService"
import { loadOpponents, loadPlayerOpponents } from "../services/fixtureService"
import { BootstrapstaticContext } from "../BootstrapstaticContext"
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
	const playerPosition = fplElements.playerPosition
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
	
	const viewNextPage = () => {
        setCurPage((curPage) => curPage+1)
    }
    const viewPreviousPage = () => {
        setCurPage((curPage) => curPage-1)
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
								<div><span className="player-num" ></span>&nbsp;<span>/</span>&nbsp;<span>15</span></div>
							</div>
							<div className="free-transfers large">
								<h4 title="Free Transfers large">FT</h4>
								<span className="transfer-number">N/A</span>
							</div>
							<div className="cost-transfers large">
								<h4 title="Transfer Cost large">TC</h4>
								<span className="points-lost">0</span>
							</div>
							<div className="remain large">
								<h4 className="large">Remaining Budget</h4>
								<span className="remain-budget">N/A</span>
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
						<button className="btn btn-block btn-chip small" id="wcard">Wildcard</button>
						<button className="btn btn-block btn-chip small" id="bbench">Bench Boost</button>
						<button className="btn btn-block btn-chip small" id="tcap">Triple Captain</button>
						<button className="btn btn-block btn-chip small" id="fhit">Free Hit</button>
					</div>}
					{showTransfersMade && <div className="transfer-rows">
						<div className="transfer-out-wrapper">
							<h4 className="small">Transfer Out</h4>
							<div className="transfer-out"></div>
						</div>
						<div className="transfer-in-wrapper">
							<h4 className="small">Transfer In</h4>
							<div className="transfer-in"></div>
						</div>
					</div>}
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
							{getPicks(players, picks, curPage, curSize).goalkeeper.map((goal, idx)=>{
								let player = players.find(x => x.id === goal.element)
								let teamObj = teams.find(x => x.id === player.team)
								let positionObj = playerPosition.find(x => x.id === player.element_type)
	                            let image = positionObj.id === 1 ? `${teamObj.code}_1-66`: `${teamObj.code}-66`
								let news = player.chance_of_playing_next_round
								let backgroundColor = news == 0 ? 'darkred' : news == 25 ? 'darkorange' :
											news == 50 ? 'orange' : news == 75 ? 'yellow' : 'rgba(0,0,55,0.9)'
								let color = news == 25 ? 'rgba(0,0,55,0.9)' :
											news == 50 ? 'rgba(0,0,55,0.9)' : news == 75 ? 'rgba(0,0,55,0.9)' :'white'
								const opponents = loadOpponents(fixtures, events, teamObj.id, gws).newTeamAandH
								const playerOpps = loadPlayerOpponents(opponents, curPage).playerFix			
								return (
									<div key={idx} className="pitch_unit">
										<div className="element_container">
										<div size="element_container" className="element_container-two">
										<button type="button" className="btn-details">
										<img src={require(`../static/shirt_${image}.webp`)} className="image_pic" alt={player.web_name}/>
										<div className="details-cont">
											<div className="data_name"
												style={{backgroundColor:backgroundColor, color:color}}>{player.web_name}
											</div>
											<div className="data_fixtures x-small">
												<div className="next-fix">{goal.selling_price}</div>
												<div className="up-fix">
													{playerOpps.map((opp, idx) => {
														return(
															<div key={idx}>
																{opp.arr.map((x, idx) => {
																	let color = x.difficulty === 4 || x.difficulty === 5 ? 
																	'rgb(255,255,255)': 'rgb(0,0,0)'
																	let backgroundColor = x.difficulty === 2 ? 'rgb(1, 252, 122)' : 
																	x.difficulty === 3 ? 'rgb(231, 231, 231)' : x.difficulty === 4 ?
																	'rgb(255, 23, 81)' : x.difficulty === 5 ? 'rgb(128, 7, 45)' : 'rgb(0,0,0)'
																	let name = teams.filter(y => y.id === x.opponent)[0].short_name
																	return (
																		<span className='opponent' style={{color: color, backgroundColor: backgroundColor}} key={idx}>{name}{x.venue}</span>)
																})}
															</div>
														)
													})}
												</div>
											</div>
										</div>
										</button>
										<button className="player-info-button player-info-pitch">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-square" viewBox="0 0 16 16">
						  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
						  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
						 </svg>
										</button>
										<button className="transfer-button">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
												  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
												</svg>
										</button>
										<button className="swap-button-out swap-button">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="darkred" className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
											  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
											  </svg>
										</button>
										</div>
										</div>
									</div>
								)
							})}
						</div>
                        
                        <div className="pitch_row" id="defend"  size="pitch">
						{getPicks(players, picks, curPage, curSize).defenders.map((defender, idx)=>{
								let player = players.find(x => x.id === defender.element)
								let teamObj = teams.find(x => x.id === player.team)
								let positionObj = playerPosition.find(x => x.id === player.element_type)
	                            let image = positionObj.id === 1 ? `${teamObj.code}_1-66`: `${teamObj.code}-66` 
								let news = player.chance_of_playing_next_round
								let backgroundColor = news == 0 ? 'darkred' : news == 25 ? 'darkorange' :
											news == 50 ? 'orange' : news == 75 ? 'yellow' : 'rgba(0,0,55,0.9)'
								let color = news == 25 ? 'rgba(0,0,55,0.9)' :
											news == 50 ? 'rgba(0,0,55,0.9)' : news == 75 ? 'rgba(0,0,55,0.9)' :'white'
								const opponents = loadOpponents(fixtures, events, teamObj.id, gws).newTeamAandH
								const playerOpps = loadPlayerOpponents(opponents, curPage).playerFix
								return (
									<div key={idx} className="pitch_unit">
										<div className="element_container">
										<div size="element_container" className="element_container-two">
										<button type="button" className="btn-details">
										<img src={require(`../static/shirt_${image}.webp`)} className="image_pic" alt={player.web_name}/>
										<div className="details-cont">
										<div className="data_name"
												style={{backgroundColor:backgroundColor, color:color}}>{player.web_name}
											</div>
											<div className="data_fixtures x-small">
												<div className="next-fix">{defender.selling_price}</div>
												<div className="up-fix">
													{playerOpps.map((opp, idx) => {
														return(
															<div key={idx}>
																{opp.arr.map((x, idx) => {
																	let color = x.difficulty === 4 || x.difficulty === 5 ? 
																	'rgb(255,255,255)': 'rgb(0,0,0)'
																	let backgroundColor = x.difficulty === 2 ? 'rgb(1, 252, 122)' : 
																	x.difficulty === 3 ? 'rgb(231, 231, 231)' : x.difficulty === 4 ?
																	'rgb(255, 23, 81)' : x.difficulty === 5 ? 'rgb(128, 7, 45)' : 'rgb(0,0,0)'
																	let name = teams.filter(y => y.id === x.opponent)[0].short_name
																	return (
																		<span className='opponent' style={{color: color, backgroundColor: backgroundColor}} key={idx}>{name}{x.venue}</span>)
																})}
															</div>
														)
													})}
												</div>
											</div>
										</div>
										</button>
										<button className="player-info-button player-info-pitch">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-square" viewBox="0 0 16 16">
						  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
						  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
						 </svg>
										</button>
										<button className="transfer-button">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
												  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
												</svg>
										</button>
										<button className="swap-button-out swap-button">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="darkred" className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
											  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
											  </svg>
										</button>
										</div>
										</div>
									</div>
								)
							})}
						</div>

						<div className="pitch_row" id="mid"   size="pitch">
						{getPicks(players, picks, curPage, curSize).midfielders.map((midfielder, idx)=>{
								let player = players.find(x => x.id === midfielder.element)
								let teamObj = teams.find(x => x.id === player.team)
								let positionObj = playerPosition.find(x => x.id === player.element_type)
	                            let image = positionObj.id === 1 ? `${teamObj.code}_1-66`: `${teamObj.code}-66` 
								let news = player.chance_of_playing_next_round
								let backgroundColor = news == 0 ? 'darkred' : news == 25 ? 'darkorange' :
											news == 50 ? 'orange' : news == 75 ? 'yellow' : 'rgba(0,0,55,0.9)'
								let color = news == 25 ? 'rgba(0,0,55,0.9)' :
											news == 50 ? 'rgba(0,0,55,0.9)' : news == 75 ? 'rgba(0,0,55,0.9)' :'white'
								const opponents = loadOpponents(fixtures, events, teamObj.id, gws).newTeamAandH
								const playerOpps = loadPlayerOpponents(opponents, curPage).playerFix
								return (
									<div key={idx} className="pitch_unit">
										<div className="element_container">
										<div size="element_container" className="element_container-two">
										<button type="button" className="btn-details">
										<img src={require(`../static/shirt_${image}.webp`)} className="image_pic" alt={player.web_name}/>
										<div className="details-cont">
										<div className="data_name"
												style={{backgroundColor:backgroundColor, color:color}}>{player.web_name}
											</div>
											<div className="data_fixtures x-small">
												<div className="next-fix">{midfielder.selling_price}</div>
												<div className="up-fix">
													{playerOpps.map((opp, idx) => {
														return(
															<div key={idx}>
																{opp.arr.map((x, idx) => {
																	let color = x.difficulty === 4 || x.difficulty === 5 ? 
																	'rgb(255,255,255)': 'rgb(0,0,0)'
																	let backgroundColor = x.difficulty === 2 ? 'rgb(1, 252, 122)' : 
																	x.difficulty === 3 ? 'rgb(231, 231, 231)' : x.difficulty === 4 ?
																	'rgb(255, 23, 81)' : x.difficulty === 5 ? 'rgb(128, 7, 45)' : 'rgb(0,0,0)'
																	let name = teams.filter(y => y.id === x.opponent)[0].short_name
																	return (
																		<span className='opponent' style={{color: color, backgroundColor: backgroundColor}} key={idx}>{name}{x.venue}</span>)
																})}
															</div>
														)
													})}
												</div>
											</div>
										</div>
										</button>
										<button className="player-info-button player-info-pitch">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-square" viewBox="0 0 16 16">
						  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
						  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
						 </svg>
										</button>
										<button className="transfer-button">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
												  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
												</svg>
										</button>
										<button className="swap-button-out swap-button">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="darkred" className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
											  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
											  </svg>
										</button>
										</div>
										</div>
									</div>
								)
							})}
						</div>

						<div className="pitch_row" id="forw"   size="pitch">
						{getPicks(players, picks, curPage, curSize).forwards.map((forward, idx)=>{
								let player = players.find(x => x.id === forward.element)
								let teamObj = teams.find(x => x.id === player.team)
								let positionObj = playerPosition.find(x => x.id === player.element_type)
	                            let image = positionObj.id === 1 ? `${teamObj.code}_1-66`: `${teamObj.code}-66` 
								let news = player.chance_of_playing_next_round
								let backgroundColor = news == 0 ? 'darkred' : news == 25 ? 'darkorange' :
											news == 50 ? 'orange' : news == 75 ? 'yellow' : 'rgba(0,0,55,0.9)'
								let color = news == 25 ? 'rgba(0,0,55,0.9)' :
											news == 50 ? 'rgba(0,0,55,0.9)' : news == 75 ? 'rgba(0,0,55,0.9)' :'white'
								const opponents = loadOpponents(fixtures, events, teamObj.id, gws).newTeamAandH
								const playerOpps = loadPlayerOpponents(opponents, curPage).playerFix
								return (
									<div key={idx} className="pitch_unit">
										<div className="element_container">
										<div size="element_container" className="element_container-two">
										<button type="button" className="btn-details">
										<img src={require(`../static/shirt_${image}.webp`)} className="image_pic" alt={player.web_name}/>
										<div className="details-cont">
										<div className="data_name"
												style={{backgroundColor:backgroundColor, color:color}}>{player.web_name}
											</div>
											<div className="data_fixtures x-small">
												<div className="next-fix">{forward.selling_price}</div>
												<div className="up-fix">
													{playerOpps.map((opp, idx) => {
														return(
															<div key={idx}>
																{opp.arr.map((x, idx) => {
																	let color = x.difficulty === 4 || x.difficulty === 5 ? 
																	'rgb(255,255,255)': 'rgb(0,0,0)'
																	let backgroundColor = x.difficulty === 2 ? 'rgb(1, 252, 122)' : 
																	x.difficulty === 3 ? 'rgb(231, 231, 231)' : x.difficulty === 4 ?
																	'rgb(255, 23, 81)' : x.difficulty === 5 ? 'rgb(128, 7, 45)' : 'rgb(0,0,0)'
																	let name = teams.filter(y => y.id === x.opponent)[0].short_name
																	return (
																		<span className='opponent' style={{color: color, backgroundColor: backgroundColor}} key={idx}>{name}{x.venue}</span>)
																})}
															</div>
														)
													})}
												</div>
											</div>
										</div>
										</button>
										<button className="player-info-button player-info-pitch">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-square" viewBox="0 0 16 16">
						  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
						  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
						 </svg>
										</button>
										<button className="transfer-button">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
												  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
												</svg>
										</button>
										<button className="swap-button-out swap-button">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="darkred" className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
											  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
											  </svg>
										</button>
										</div>
										</div>
									</div>
								)
							})}
						</div>
						</> : <Loader />}
						
					</div>
					<div className="bench" id="bench">
						<div className="bench_element">
						</div>
					</div>
				</div>
			</div>
			
		</div>
  )
}

export default Pitch