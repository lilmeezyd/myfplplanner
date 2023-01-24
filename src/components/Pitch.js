import { useContext, useState, useEffect } from "react"
import { getGameweeks } from "../services/timeService"
import { BootstrapstaticContext } from "../BootstrapstaticContext"
import prevPage from "../static/chevron_left.png"
import nextPage from "../static/chevron_right.png"

function Pitch() {

	const fplElements = useContext(BootstrapstaticContext)
	const events = fplElements.events
	const curSize = 1
	const [ curPage, setCurPage ] = useState(1)
	//const [ countdowns, setCoundowns ] = useState([])
	const gameweeks = getGameweeks(events, curPage, curSize).gameweeks
	const length = getGameweeks(events, curPage, curSize).length
	const countdowns = getGameweeks(events, curPage, curSize).countdowns
	const [ showTransfers, setShowTransfers ] = useState(true)
	const [ showTransfersMade, setShowTransfersMade ] = useState(false)
	const [ showChips, setShowChips ] = useState(false)
	
	/*useEffect(() => {
		setInterval(() => {
		setCoundowns(getGameweeks(events, curPage, curSize).countdowns)
	}, 100)
	}, [])

	const getCountdownArray = () => {
		setCoundowns(getGameweeks(events, curPage, curSize).countdowns)
	}*/
	const viewNextPage = () => {
        setCurPage(curPage+1)
    }
    const viewPreviousPage = () => {
        setCurPage(curPage-1)
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
                        
						<div className="pitch_row" id="goal"  size="pitch">
						</div>
                        
                        <div className="pitch_row" id="defend"  size="pitch">
							
						</div>

						<div className="pitch_row" id="mid"   size="pitch">
							
						</div>

						<div className="pitch_row" id="forw"   size="pitch">
							
						</div>
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