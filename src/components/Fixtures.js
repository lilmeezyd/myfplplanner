import { useContext, useState } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'
import { numberOfFixtures, loadOpponents } from '../services/fixtureService'
import Loader from './Loader'
import TeamRow from './TeamRow'

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
			{(events.length && teams.length && fixtures.length) ?
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
							<th style={{background: 'white'}}>Team</th>
							{fixHeader.map((header) => {
								return (
									<th style={{background: 'white'}} key={header.id}>GW{header.id}</th>
								)
							})}
						</tr>
					</thead>
					<tbody className="small triple">
						{teams.map((team) => {
							const opponents = loadOpponents(fixtures, events, team.id, gws).newTeamAandH
							return(
								<TeamRow
								teams={teams}
								 team={team} key={team.id} opponents={opponents} />
							)
						})}
					</tbody>
				</table>
			</div> : <Loader />}
		</div>
  )
}

export default Fixtures