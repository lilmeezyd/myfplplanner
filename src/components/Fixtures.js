import { useContext, useState } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'
import { numberOfFixtures, loadOpponents } from '../services/fixtureService'

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
							<th></th>
							{fixHeader.map((header, idx) => {
								return (
									<th key={idx}>GW{header.id}</th>
								)
							})}
						</tr>
					</thead>
					<tbody className="small triple">
						{teams.map((team, idx) => {
							const opponents = loadOpponents(fixtures, events, team.id, gws).newTeamAandH
							return(
							<tr key={idx}>
								<td>
									<span className="ticker-image">
										<img src={require(`../static/t${team.code}.png`)} alt={team.name} />
									</span>
									<span className="ticker-team">{team.name}</span>
								</td>
								{opponents.map((cell, idx) => {
									return (<td key={idx}>
										{cell.arr.map((x, idx) => {
											let color = x.difficulty === 4 || x.difficulty === 5 ? 
											'rgb(255,255,255)': 'rgb(0,0,0)'
											let backgroundColor = x.difficulty === 2 ? 'rgb(1, 252, 122)' : 
											x.difficulty === 3 ? 'rgb(231, 231, 231)' : x.difficulty === 4 ?
											'rgb(255, 23, 81)' : x.difficulty === 5 ? 'rgb(128, 7, 45)' : 'rgb(0,0,0)'
											let name = teams.filter(y => y.id === x.opponent)[0].short_name
											return (
											<span className='opponent' style={{color: color, backgroundColor: backgroundColor}} key={idx}>{name}{x.venue}</span>)
										})}
									</td>)
								})}
							</tr>)
						})}
					</tbody>
				</table>
			</div>
		</div>
  )
}

export default Fixtures