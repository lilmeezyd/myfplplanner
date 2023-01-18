import { useState, useContext } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'
import { getMinMax, getPlayers, getArrangedPlayers, viewNext } from '../services/index'
import lastPage from '../static/last_page.png'
import firstPage from '../static/first_page.png'
import prevPage from "../static/chevron_left.png"
import nextPage from "../static/chevron_right.png"

function Players(props) {
    
    const fplElements = useContext(BootstrapstaticContext)
    const teams = fplElements.teams
    const playerPosition = fplElements.playerPosition
    const [ sort, setSort ] = useState('total_points')
    const [ view, setView ] = useState('allPlayers')
    const [ word, setWord ] = useState('')
    const [ cutPrice, setCutPrice ] = useState(25)
    const [ curPage, setCurPage ] = useState(1)
    const pageSize = 30
    const players = getPlayers(fplElements.players, sort, view, word, cutPrice).returnedPlayers
    const goalkeepers = getArrangedPlayers(players, curPage, pageSize).goalkeepers
    const defenders = getArrangedPlayers(players, curPage, pageSize).defenders
    const midfielders = getArrangedPlayers(players, curPage, pageSize).midfielders
    const forwards = getArrangedPlayers(players, curPage, pageSize).forwards
    const prices = getMinMax(fplElements.players).prices
    const minPrice = getMinMax(players).minPrice
    const maxPrice = getMinMax(players).maxPrice
    let totalPages = Math.ceil(players.length/pageSize)
        
    


    const onPrice = (e) => {
        setCutPrice(+e.target.value)
        setCurPage(1)
    }

    const onSearch = (e) => {
        setWord(e.target.value)
        setCurPage(1)
    }

    const onSort = (e) => {
        setSort(e.target.value)
        setCurPage(1)
    }

    const onView = (e) => {
        setView(e.target.value)
        setCurPage(1)
    }

    const viewNextPage = () => {
        setCurPage(curPage+1)
    }
    const viewPreviousPage = () => {
        setCurPage(curPage-1)
    }

    const viewFirstPage = () => {
        setCurPage(1)
    }

    const viewLastPage = () => {
        setCurPage(totalPages)
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
                                            <option key={idx} value={positionId}>{pPos.singular_name}s</option>
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
                            <option value="total_points">Total points</option>
                            <option value="event_points">Round points</option>
                        <option value="now_cost">Price</option>
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
                    <input onChange={onSearch} id="search" className="blur" type="text" name=""/>
                </div>
                <div className="cost">
                    <label>Max cost</label>
                    <div>Between <span id="pMin">{minPrice.toFixed(1)}</span> and <span id="pMax">{maxPrice.toFixed(1)}</span></div>
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
        <span className="number">{players.length}</span>
        <span className="numbers">{players.length === 1 ? 'Player' : 'Players'}</span>
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
                    <td><span className="points">{sort === 'event_points' ? goalkeeper.event_points : goalkeeper.total_points}</span></td>
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
                    <td><span className="points">{sort === 'event_points' ? defender.event_points : defender.total_points}</span></td>
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
                    <td><span className="points">{sort === 'event_points' ? midfielder.event_points : midfielder.total_points}</span></td>
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
                    <td><span className="points">{sort === 'event_points' ? forward.event_points : forward.total_points}</span></td>
                </tr>)
                })}
            </tbody>
        </table>): ''}
    </div>
    <div className="button-controls">
        <button disabled={curPage === 1 ? true : false}  onClick={viewFirstPage} className="btn btn-controls" id="firstPage">
            <img src={firstPage} alt="first_page"/>
        </button>
        <button disabled={curPage === 1 ? true : false} onClick={viewPreviousPage} className="btn btn-controls" id="prevButton">
            <img src={prevPage} alt="prev_page"/>
        </button>
        <div className="pages">
            <span className="current">{curPage}</span>
            <span>of</span>
            <span className="total_pages">{totalPages}</span>
        </div>
        <button disabled={curPage === totalPages ? true : false} onClick={viewNextPage} className="btn btn-controls" id="nextButton">
            <img src={nextPage} alt="next_page"/>
        </button> 
        <button disabled={curPage === totalPages ? true : false} onClick={viewLastPage} className="btn btn-controls" id="lastPage">
            <img src={lastPage} alt="last_page"/>
        </button>
    </div>
</div>
    </div>
  )
}

export default Players