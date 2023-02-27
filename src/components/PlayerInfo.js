import { useContext } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'

function PlayerInfo(props) {

    const fplElements = useContext(BootstrapstaticContext)
    const { playerPos, onClick } = props

    const playerDetails = () => {
        const player = fplElements.players.find(x => x.id === playerPos.element)
        let name = `${player.first_name} ${player.second_name}`
        let team = fplElements.teams.find(x => x.id === player.team).name
        let position = fplElements.playerPosition
                               .find(x => x.id === player.element_type).singular_name
        
        return { name, team, position}
    }
  return (
    <div className="playerpop1">
        <div className="info-details">
            <span className='large'>{playerDetails().name}</span>
            <span className='small'>{playerDetails().team}</span>
			<span className='small'>{playerDetails().position}</span>
			<button
                onClick={onClick}
             className="btn btn-close btn-close-info btn-danger btn-player">
                <svg style={{color: 'white'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="white"></path> </svg>
      </button>
      </div>
      <div className="games-info">
        <div className="games-info-buttons">
          <button className="btn btn-fpl btn-block  btn-game-results">Results</button>
				  <button className="btn btn-block btn-fpl btn-game-fixtures">Fixtures</button>
        </div>
        <div className="games-info-fixtures">
          <table className="table" style={{width: '100%'}}>
            <thead>
              <tr>
                <th>Date</th>
                <th>GW</th>
                <th>Fixture</th>
                <th>FDR</th>
              </tr>
            </thead>
            <tbody className="t-fixtures"></tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PlayerInfo