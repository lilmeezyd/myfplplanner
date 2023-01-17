import { useState, useContext } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'
import { getMinMax, getPlayers } from '../services/index'
import lastPage from '../static/last_page.png'
import firstPage from '../static/first_page.png'
import prevPage from "../static/chevron_left.png"
import nextPage from "../static/chevron_right.png"

function Players(props) {
    
    const fplElements = useContext(BootstrapstaticContext)
    const teams = fplElements.teams
    const playerPosition = fplElements.playerPosition
    const [ sort, setSort ] = useState('totalPoints')
    const [ view, setView ] = useState('allPlayers')
    const players = getPlayers(fplElements.players, sort, view).returnedPlayers
    const goalkeepers = getPlayers(fplElements.players, sort, view).goalkeepers
    const defenders = getPlayers(fplElements.players, sort, view).defenders
    const midfielders = getPlayers(fplElements.players, sort, view).midfielders
    const forwards = getPlayers(fplElements.players, sort, view).forwards
    const prices = getMinMax(players).prices
    const minPrice = getMinMax(players).minPrice
    const maxPrice = getMinMax(players).maxPrice
        
    //const [ cutPrice, setCutPrice ] = useState(maxPrice)


    const onPrice = (e) => {
        //setCutPrice(e.target.value)
    }

    const onSort = (e) => {
        setSort(e.target.value)
    }

    const onView = (e) => {
        setView(e.target.value)
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
                            <select onChange={onView} className="custom-select small" id="view_by">
                                <optgroup label="Global">
                                    <option value="allPlayers">All Players</option>
                                </optgroup>
                                <optgroup label='By Position'>
                                    {playerPosition.map((pPos, idx) => {
                                        let positionId = 'position_'+pPos.id
                                        return(
                                            <option key={idx} value={positionId}>{pPos.singular_name}</option>
                                        )
                                    }
                                     )}
                                </optgroup>
                                <optgroup label='By Team'>
                                    {teams.map((team, idx)=> {
                                        let teamId = 'team_'+team.id
                                        return (
                                            <option key={idx} value={teamId}>{team.name}</option>)
                                    }
                                    )}
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
                    <div>Between <span id="pMin">{minPrice}</span> and <span id="pMax">{maxPrice}</span></div>
                    <select onChange={onPrice} className="custom-select" id="cost_by">
                        {prices.map((price, idx) => 
                                <option key={idx} value={price}>{price}</option>
                          )}
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
        { goalkeepers.length > 0 ? (<table className='table-one' id='goalkeepers'>
            <thead>
                <tr>
                    <th></th>
                    <th className='positiion-table'>Goalkeepers</th>
                    <th>£</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                {goalkeepers.map((goalkeeper, idx) => {
                    let teamObj = teams.find(x => x.id === goalkeeper.team)
                    let news = goalkeeper.chance_of_playing_next_round
                    let short_name = teamObj.short_name
                    let team_name = teamObj.name
                    let positionObj = playerPosition.find(x => x.id === goalkeeper.element_type)
                    let short_pos = positionObj.singular_name_short
                    let pos_name = positionObj.singular_name
                    let forwardImage = positionObj.id === 1 ? `${teamObj.code}_1-66`:
			            `${teamObj.code}-66`
                    return (<tr key={idx} className="player-tbh">
                    <td className="info">
                        <button></button>
                    </td>
                    <td className="player">
                        <button className="player-cell btn-table">
                            <div className="images">
                            <img src={require(`../static/shirt_${forwardImage}.webp`)} />
                            </div>
                            <div className="player-cell-info small">
                                <span className="name">{goalkeeper.web_name}</span>
                                <div className="player-cell-details">
                                    <span className="name">{short_name}</span>
                                    <span className="position">{short_pos}</span>
                                </div>
                            </div>
                        </button>
                    </td>
                    <td><span className="price">{(goalkeeper.now_cost/10).toFixed(1)}</span></td>
                    <td><span className="points">{goalkeeper.total_points}</span></td>
                </tr>)
                })}
            </tbody>
        </table>): ''}
        { defenders.length > 0 ? (<table className='table-one' id='defenders'>
            <thead>
                <tr>
                    <th></th>
                    <th className='positiion-table'>Defenders</th>
                    <th>£</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                {defenders.map((defender, idx) => {
                    let teamObj = teams.find(x => x.id === defender.team)
                    let news = defender.chance_of_playing_next_round
                    let short_name = teamObj.short_name
                    let team_name = teamObj.name
                    let positionObj = playerPosition.find(x => x.id === defender.element_type)
                    let short_pos = positionObj.singular_name_short
                    let pos_name = positionObj.singular_name
                    let forwardImage = positionObj.id === 1 ? `${teamObj.code}_1-66`:
			            `${teamObj.code}-66`

                    return (<tr key={idx} className="player-tbh">
                    <td className="info">
                        <button></button>
                    </td>
                    <td className="player">
                        <button className="player-cell btn-table">
                            <div className="images">
                            <img src={require(`../static/shirt_${forwardImage}.webp`)} />
                            </div>
                            <div className="player-cell-info small">
                                <span className="name">{defender.web_name}</span>
                                <div className="player-cell-details">
                                    <span className="team">{short_name}</span>
                                    <span className="position">{short_pos}</span>
                                </div>
                            </div>
                        </button>
                    </td>
                    <td><span className="price">{(defender.now_cost/10).toFixed(1)}</span></td>
                    <td><span className="points">{defender.total_points}</span></td>
                </tr>)
                })}
            </tbody>
        </table>): ''}
        { midfielders.length > 0 ? (<table className='table-one' id='midfielders'>
            <thead>
                <tr>
                    <th></th>
                    <th className='positiion-table'>Midfielders</th>
                    <th>£</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                {midfielders.map((midfielder, idx) => {
                    let teamObj = teams.find(x => x.id === midfielder.team)
                    let news = midfielder.chance_of_playing_next_round
                    let short_name = teamObj.short_name
                    let team_name = teamObj.name
                    let positionObj = playerPosition.find(x => x.id === midfielder.element_type)
                    let short_pos = positionObj.singular_name_short
                    let pos_name = positionObj.singular_name
                    let forwardImage = positionObj.id === 1 ? `${teamObj.code}_1-66`:
			            `${teamObj.code}-66`
                    return (<tr key={idx} className="player-tbh">
                    <td className="info">
                        <button></button>
                    </td>
                    <td className="player">
                        <button className="player-cell btn-table">
                            <div className="images">
                            <img src={require(`../static/shirt_${forwardImage}.webp`)} />
                            </div>
                            <div className="player-cell-info small">
                                <span className="name">{midfielder.web_name}</span>
                                <div className="player-cell-details">
                                    <span className="team">{short_name}</span>
                                    <span className="position">{short_pos}</span>
                                </div>
                            </div>
                        </button>
                    </td>
                    <td><span className="price">{(midfielder.now_cost/10).toFixed(1)}</span></td>
                    <td><span className="points">{midfielder.total_points}</span></td>
                </tr>)
                })}
            </tbody>
        </table>): ''}
        { forwards.length > 0 ? (<table className='table-one' id='forwards'>
            <thead>
                <tr>
                    <th></th>
                    <th className='positiion-table'>Forwards</th>
                    <th>£</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                {forwards.map((forward, idx) => {
                    let teamObj = teams.find(x => x.id === forward.team)
                    let news = forward.chance_of_playing_next_round
                    let short_name = teamObj.short_name
                    let team_name = teamObj.name
                    let positionObj = playerPosition.find(x => x.id === forward.element_type)
                    let short_pos = positionObj.singular_name_short
                    let pos_name = positionObj.singular_name
                    let forwardImage = positionObj.id === 1 ? `${teamObj.code}_1-66`:
			            `${teamObj.code}-66`
                    return (<tr key={idx} className="player-tbh">
                    <td className="info">
                        <button></button>
                    </td>
                    <td className="player">
                        <button className="player-cell btn-table">
                            <div className="images">
                            <img src={require(`../static/shirt_${forwardImage}.webp`)} />
                            </div>
                            <div className="player-cell-info small">
                                <span className="name">{forward.web_name}</span>
                                <div className="player-cell-details">
                                    <span className="team">{short_name}</span>
                                    <span className="position">{short_pos}</span>
                                </div>
                            </div>
                        </button>
                    </td>
                    <td><span className="price">{(forward.now_cost/10).toFixed(1)}</span></td>
                    <td><span className="points">{forward.total_points}</span></td>
                </tr>)
                })}
            </tbody>
        </table>): ''}
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