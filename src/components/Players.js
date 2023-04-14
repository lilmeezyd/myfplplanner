import { useState, useContext } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'
import PlayerCard from './PlayerCard'
import { getMinMax, getPlayers, getArrangedPlayers } from '../services/playerService'
import lastPage from '../static/last_page.png'
import firstPage from '../static/first_page.png'
import prevPage from "../static/chevron_left.png"
import nextPage from "../static/chevron_right.png"
//import Loader from './Loader'

function Players(props) {
    
    const fplElements = useContext(BootstrapstaticContext)
    const teams = fplElements.teams
    const playerPosition = fplElements.playerPosition
    const { handleShow, handleClose, showPop } = props
    const [ sort, setSort ] = useState('total_points')
    const [ view, setView ] = useState('allPlayers')
    const [ word, setWord ] = useState('')
    const [ cutPrice, setCutPrice ] = useState(25)
    const [ curPage, setCurPage ] = useState(1)
    const pageSize = 20
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
                            <select onChange={onSort} className="custom-select small" id="sort_by">
                            <option value="total_points">Total points</option>
                            <option value="event_points">Round points</option>
                        <option value="now_cost">Price</option>
                    </select>
                </div>
                <div className="search">
                    <label>Search</label>
                    <input onChange={onSearch} id="search" className="blur" type="text" name=""/>
                </div>
                <div className="cost">
                    <label>Max cost</label>
                    <div>Between <span id="pMin">{minPrice.toFixed(1)}</span> and <span id="pMax">{maxPrice.toFixed(1)}</span></div>
                    <select onChange={onPrice} className="custom-select small" id="cost_by">
                        {prices.map((price, idx) => 
                                <option key={idx} value={price}>{price}</option>
                          )}
                    </select>
                </div>
            </form>
        </div>
    </div>
</div>

{(players.length) ? 
<div className="player-info">
    <div className="player-numbers small">
        <span className="number">{players.length}</span>
        <span className="numbers">{players.length === 1 ? 'Player' : 'Players'}</span>
    </div>
    <div className="players-table small">
        { goalkeepers.length > 0 ? <div className='table-one' id='goalkeepers'>
            <div className='player-header'>
                <div className='info'></div>
                <div className='position-table'>Goalkeepers</div>
                <div className='money'>£</div>
                <div className='others'>Points</div>
            </div>
            <div>
                {goalkeepers.map((goalkeeper) => {
                    let teamObj = teams.find(x => x.id === goalkeeper.team)
                    let news = goalkeeper.chance_of_playing_next_round
                    let short_name = teamObj.short_name
                    let positionObj = playerPosition.find(x => x.id === goalkeeper.element_type)
                    let short_pos = positionObj.singular_name_short
                    let forwardImage = positionObj.id === 1 ? `${teamObj.code}_1-66`:
			            `${teamObj.code}-66`
                    let backgroundColor = news === 0 ? 'darkred' : news === 25 ? 'darkorange' :
                    news === 50 ? 'orange' : news === 75 ? 'yellow' : 'white'
                    let color = news === 0 ? 'white' : news === 25 ? 'white' :
                    news === 50 ? 'white' : 'black'    
                    return (<PlayerCard 
                                key={goalkeeper.id}
                                backgroundColor={backgroundColor}
                                color={color}
                                forwardImage={forwardImage}
                                playerPos={goalkeeper}
                                shortName={short_name}
                                shortPos={short_pos}
                                position={positionObj.id}
                                team={teamObj.id}
                                sort={sort}
                                handleShow={handleShow}
                                handleClose={handleClose}
                                showPop={showPop}></PlayerCard>)
                })}
            </div>
        </div>: ''}
        { defenders.length > 0 ? (<div className='table-one' id='defenders'>
        <div className='player-header'>
                <div className='info'></div>
                <div className='position-table'>Defenders</div>
                <div className='money'>£</div>
                <div className='others'>Points</div>
            </div>
            <div>
                {defenders.map((defender) => {
                    let teamObj = teams.find(x => x.id === defender.team)
                    let news = defender.chance_of_playing_next_round
                    let short_name = teamObj.short_name
                    let positionObj = playerPosition.find(x => x.id === defender.element_type)
                    let short_pos = positionObj.singular_name_short
                    let forwardImage = positionObj.id === 1 ? `${teamObj.code}_1-66`:
			            `${teamObj.code}-66`
                        let backgroundColor = news === 0 ? 'darkred' : news === 25 ? 'darkorange' :
                        news === 50 ? 'orange' : news === 75 ? 'yellow' : 'white'
                        let color = news === 0 ? 'white' : news === 25 ? 'white' :
                        news === 50 ? 'white' : 'black'    
                        return (<PlayerCard 
                            key={defender.id}
                            backgroundColor={backgroundColor}
                            color={color}
                            forwardImage={forwardImage}
                            playerPos={defender}
                            shortName={short_name}
                            shortPos={short_pos}
                            position={positionObj.id}
                            team={teamObj.id}
                            sort={sort}
                            handleShow={handleShow}
                            handleClose={handleClose}
                            showPop={showPop}></PlayerCard>)
                })}
            </div>
        </div>): ''}
        { midfielders.length > 0 ? (<div className='table-one' id='midfielders'>
        <div className='player-header'>
                <div className='info'></div>
                <div className='position-table'>Midfielders</div>
                <div className='money'>£</div>
                <div className='others'>Points</div>
            </div>
            <div>
                {midfielders.map((midfielder) => {
                    let teamObj = teams.find(x => x.id === midfielder.team)
                    let news = midfielder.chance_of_playing_next_round
                    let short_name = teamObj.short_name
                    let positionObj = playerPosition.find(x => x.id === midfielder.element_type)
                    let short_pos = positionObj.singular_name_short
                    let forwardImage = positionObj.id === 1 ? `${teamObj.code}_1-66`:
			            `${teamObj.code}-66`
                        let backgroundColor = news === 0 ? 'darkred' : news === 25 ? 'darkorange' :
                        news === 50 ? 'orange' : news === 75 ? 'yellow' : 'white'
                        let color = news === 0 ? 'white' : news === 25 ? 'white' :
                        news === 50 ? 'white' : 'black'    
                        return (<PlayerCard 
                            key={midfielder.id}
                            backgroundColor={backgroundColor}
                            color={color}
                            forwardImage={forwardImage}
                            playerPos={midfielder}
                            shortName={short_name}
                            shortPos={short_pos}
                            position={positionObj.id}
                            team={teamObj.id}
                            sort={sort}
                            handleShow={handleShow}
                            handleClose={handleClose}
                            showPop={showPop}></PlayerCard>)
                })}
            </div>
        </div>): ''}
        { forwards.length > 0 ? (<div className='table-one' id='forwards'>
        <div className='player-header'>
                <div className='info'></div>
                <div className='position-table'>Forwards</div>
                <div className='money'>£</div>
                <div className='others'>Points</div>
            </div>
            <>
                {forwards.map((forward) => {
                    let teamObj = teams.find(x => x.id === forward.team)
                    let news = forward.chance_of_playing_next_round
                    let short_name = teamObj.short_name
                    let positionObj = playerPosition.find(x => x.id === forward.element_type)
                    let short_pos = positionObj.singular_name_short
                    let forwardImage = positionObj.id === 1 ? `${teamObj.code}_1-66`:
			            `${teamObj.code}-66`
                        let backgroundColor = news === 0 ? 'darkred' : news === 25 ? 'darkorange' :
                        news === 50 ? 'orange' : news === 75 ? 'yellow' : 'white'
                        let color = news === 0 ? 'white' : news === 25 ? 'white' :
                        news === 50 ? 'white' : 'black'    
                        return (<PlayerCard 
                            key={forward.id}
                            backgroundColor={backgroundColor}
                            color={color}
                            forwardImage={forwardImage}
                            playerPos={forward}
                            shortName={short_name}
                            shortPos={short_pos}
                            position={positionObj.id}
                            team={teamObj.id}
                            sort={sort}
                            handleShow={handleShow}
                            handleClose={handleClose}
                            showPop={showPop}></PlayerCard>)
                })}
            </>
        </div>): ''}
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
</div> : <div className='no-trans small'>No Players Found</div>}
    </div>
  )
}

export default Players