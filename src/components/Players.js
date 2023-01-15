import { useState } from 'react'
import lastPage from '../static/last_page.png'
import firstPage from '../static/first_page.png'
import prevPage from "../static/chevron_left.png"
import nextPage from "../static/chevron_right.png"
function Players() {

    const [ sort, setSort ] = useState('totalPoints')

    const onSort = (e) => {
        setSort(e.target.value)
    }
  return (
    
	<div className="players-col">
        <div className="players small">
            <div className="players-container">
                <div className="players-heading-container">
                    <h3 className="players-heading">Player Selection</h3>
                </div>
                <div className="form">
                    <form>
                        <div className="view">
                            <label>View</label>
                            <select className="custom-select small" id="view_by">
                                <optgroup label="Global">
                                    <option value="all players">All Players</option>
                                </optgroup>
                            </select>
                        </div>
                        <div className="sort">
                            <label>Sorted by</label>
                            <select onChange={onSort} className="custom-select" id="sort_by">
                            <option value="totalPoints">Total points</option>
                            <option value="eventPoints">Round points</option>
                        <option value="nowCost">Price</option>
                        <option>Team selected by %</option>
                        <option>Minutes played</option>
                        <option>Goals scored</option>
                        <option>Assists</option>
                        <option>Clean sheets</option>
                        <option>Goals conceded</option>
                        <option>Own goals</option>
                        <option>Penalties saved</option>
                        <option>Penalties missed</option>
                        <option>Yellow cards</option>
                        <option>Red cards</option>
                        <option>Saves</option>
                        <option>Points per match</option>
                        <option>Transfers in</option>
                        <option>Transfers out</option>
                        <option>Transfers in(round)</option>
                        <option>Transfers out(round)</option>
                        <option>Price rise</option>
                        <option>Price fall</option>
                        <option>Price rise(round)</option>
                        <option>Price fall(round)</option>
                    </select>
                </div>
                <div className="search">
                    <label>Search</label>
                    <input id="search" className="blur" type="text" name=""/>
                </div>
                <div className="cost">
                    <label>Max cost</label>
                    <div>Between <span id="pMin"></span> and <span id="pMax"></span></div>
                    <select className="custom-select" id="cost_by">
                    </select>
                </div>
            </form>
        </div>
    </div>
</div>

<div className="player-info">
    <div className="player-numbers">
        <span className="number"></span>
        <span className="numbers"></span>
    </div>
    <div className="players-table small">
        <table id="goalkeepers" className="table-one">
            <thead>
                <tr>
                    <th></th>
                    <th className="position-table">Goalkeepers</th>
                    <th>£</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                <tr><td colSpan="4"><i>Loading...</i></td></tr>
            </tbody>
        </table>
        <table id="defenders" className="table-one">
            <thead>
                <tr>
                    <th></th>
                    <th className="position-table">Defenders</th>
                    <th>£</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                <tr><td colSpan="4"><i>Loading...</i></td></tr>
            </tbody>
        </table>
        <table id="midfielders" className="table-one">
            <thead>
                <tr>
                    <th></th>
                    <th className="position-table">Midfielders</th>
                    <th>£</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                <tr><td colSpan="4"><i>Loading...</i></td></tr>
            </tbody>
        </table>
        <table id="forwards" className="table-one">
            <thead>
                <tr>
                    <th></th>
                    <th className="position-table">Forwards</th>
                    <th>£</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                <tr><td colSpan="4"><i>Loading...</i></td></tr>
            </tbody>
        </table>
    </div>
    <div className="button-controls">
        <button className="btn btn-controls" id="firstPage">
            <img src={firstPage} alt="first_page"/>
        </button>
        <button className="btn btn-controls" id="prevButton">
            <img src={prevPage} alt="prev_page"/>
        </button>
        <div className="pages">
            <span className="current"></span>
            <span>of</span>
            <span className="total_pages"></span>
        </div>
        <button className="btn btn-controls" id="nextButton">
            <img src={nextPage} alt="next_page"/>
        </button>
        <button className="btn btn-controls" id="lastPage">
            <img src={lastPage} alt="last_page"/>
        </button>
    </div>
</div>
    </div>
  )
}

export default Players