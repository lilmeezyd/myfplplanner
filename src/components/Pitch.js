import prevPage from "../static/chevron_left.png"
import nextPage from "../static/chevron_right.png"

function Pitch() {
  return (
    <div class="transfers-col">
			<div>
				<div className="details-one">
					<div class="gw-buttonswrapper">
						<div class="gw-buttons">
							<button class="btn btn-fpl small prev_next" id="prevGameweek">
								<img src={prevPage} alt="prev_page" />
							</button>
							<div id="deadline">
								<h4 id="gameweekNum" className="large"></h4>
								<div class="large">
									<h4 className="theading">Deadline In:</h4>
									<div class="ttime small">
										<div>
											<span id="day"></span><span>Days</span>
										</div>
										<div>
											<span id="hour"></span><span>Hrs</span>
										</div>
										<div>
											<span id="minute"></span><span>Mins</span>
										</div>
										<div>
											<span id="second"></span><span>Secs</span>
										</div>
									</div>
								</div>
							</div>
							<button class="btn btn-fpl small prev_next" id="nextGameweek">
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
						<div id="transfer" className="tab-item tab-border">
							<p className="large">Transfers</p>
						</div>
						<div id="chip" className="tab-item">
							<p className="large">Chips</p>
						</div>
					</div>
					<div id="transfer-tab"  className="upper-buttons button-item show">
						<button className="btn btn-block show-fpl btn-fpl small">Transfers</button>
						<button className="btn btn-block reset btn-fpl small">Reset</button>
					</div>
					<div id="chip-tab"  className="chip-buttons button-item">
						<button className="btn btn-block btn-chip small" id="wcard">Wildcard</button>
						<button className="btn btn-block btn-chip small" id="bbench">Bench Boost</button>
						<button className="btn btn-block btn-chip small" id="tcap">Triple Captain</button>
						<button className="btn btn-block btn-chip small" id="fhit">Free Hit</button>
					</div>
					<div className="transfer-rows">
						<div className="transfer-out-wrapper">
							<h4 className="small">Transfer Out</h4>
							<div className="transfer-out"></div>
						</div>
						<div className="transfer-in-wrapper">
							<h4 className="small">Transfer In</h4>
							<div className="transfer-in"></div>
						</div>
					</div>
					<div className="message small"></div>
				</div>
				<div className="field">
					<div className="pitch">
						<div className="tname-details large">
							<span className="theading">Name</span>
							<h4 className="tname"></h4>
						</div>
						<div className="trank-details large">
							<span className="theading">Overall Rank</span>
							<div>
								<h4 className="trank"></h4>
								<div className="arrow">
								
							</div>
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