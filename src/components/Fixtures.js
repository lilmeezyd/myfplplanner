import { useContext, useState } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'
import { numberOfFixtures } from '../services/fixtureService'

function Fixtures() {

	const fplElements = useContext(BootstrapstaticContext)
	const events = fplElements.events
	const fixOptions = numberOfFixtures(events).fixOptions
	const [ gws, setGws ] = useState('')

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
					<span className="small">Gameweeks</span>
				</div>
				<table className="ticker-table">
				</table>
			</div>
		</div>
  )
}

export default Fixtures