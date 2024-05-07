import { useContext, useState, Suspense } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'
import { numberOfFixtures, loadStartGw } from '../services/fixtureService'
import Loader from './Loader'
import TeamRow from './TeamRow'

function Fixtures() {

	const fplElements = useContext(BootstrapstaticContext)
	const events = fplElements.events
	const teams = fplElements.teams
	const fixtures = fplElements.fixtures
	const event = +fplElements.eventId + 1
	const [ gws, setGws ] = useState(38)
	const [ start, setStart ] = useState(0)
	const fixOptions = numberOfFixtures(events, gws, start).fixOptions
	const fixHeader = numberOfFixtures(events, gws, start).fixHeader

  return (
    <div className="fixtures-col">
			<h4 className="large fixture-heading">Fixture Ticker</h4>
			<Suspense fallback={<Loader/>}>
				{(!!events.length && !!teams.length && !!fixtures.length) ?
				<div className="fixture-ticker">
					<div className='next-fixtures'>
						<label htmlFor='next-fixture' className='small'>From Gameweek</label>
						<select
						onChange={(e) => setStart(+e.target.value)}
						 className='custom-select custom-select-next' id='next-fixture' name='next-fixture'>
							{loadStartGw(event).map((x, idx) => {
								return (
									<option key={idx} value={idx}>{x}</option>
								)
							})}
						</select>
					</div>
					<div className="next-fixtures">
						<label htmlFor='nxt_fixtures' className="small">Next:</label>
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
								<th style={{background: 'white'}}></th>
								{fixHeader.map((header) => {
									return (
										<th style={{background: 'white'}} key={header.id}>GW{header.id}</th>
									)
								})}
							</tr>
						</thead>
						{/* Problem here */}
						<tbody className="small triple">
							{teams.map((team) => {
								return(
									<TeamRow
									gws={gws} start={start}
									team={team} key={team.id} />
								)
							})}
						</tbody>
						{/* Problem here */}
						</table>
				</div>
				 : <div className='no-trans small'>No Fixtures Found</div>}
			</Suspense>
		</div>
  )
}

export default Fixtures