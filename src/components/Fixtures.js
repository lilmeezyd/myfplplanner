import { useContext, useState } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'
import { numberOfFixtures } from '../services/fixtureService'

function Fixtures() {

	const fplElements = useContext(BootstrapstaticContext)
	const events = fplElements.events
	const teams = fplElements.teams
	const fixtures = fplElements.fixtures
	const [ gws, setGws ] = useState(38)
	const fixOptions = numberOfFixtures(events, gws).fixOptions
	const fixHeader = numberOfFixtures(events, gws).fixHeader

  return (
    <div className="fixtures-col">
			<h4 className="large fixture-heading">Fixture Ticker</h4>
			<div className="fixture-ticker">
            <div className="next-fixtures">
					<label className="small">Next:</label>
					<select onChange={(e) => setGws(+e.target.value)} className="custom-select custom-select-next" id="nxt_fixtures">
						{fixOptions.map((fix, idx) => {
							return (
							<option key={idx} value={fix}>{fix}</option>
							)
							
						})}
					</select>
					<span className="small">{gws === 1 ? 'Gameweek' : 'Gameweeks'}</span>
				</div>
				<table className="ticker-table">
					<thead className="small">
						<tr>
							<th>Team</th>
							{fixHeader.map((header, idx) => {
								return (
									<th key={idx}>GW{header.id}</th>
								)
							})}
						</tr>
					</thead>
					<tbody className="small triple">
						{teams.map((team, idx) => {
							return(
							<tr key={idx}>
								<td>
									<span className="ticker-image">
										<img src={require(`../static/t${team.code}.png`)} alt={team.name} />
									</span>
									<span className="ticker-team">{team.name}</span>
								</td>
							</tr>)
						})}
					</tbody>
				</table>
			</div>
		</div>
  )
}

export default Fixtures