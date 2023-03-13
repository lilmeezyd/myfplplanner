import { useContext, useState } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'
import { loadOpponents } from '../services/fixtureService'

function PlayerInfo(props) {

    const fplElements = useContext(BootstrapstaticContext)
    const events = fplElements.events
    const fixtures = fplElements.fixtures
    const teams = fplElements.teams
    const { playerPos, bgColor, onClick } = props

    const playerDetails = () => {
        const player = fplElements.players.find(x => x.id === playerPos)
        let name = `${player.first_name} ${player.second_name}`
        let team = fplElements.teams.find(x => x.id === player.team).name
        let teamId = fplElements.teams.find(x => x.id === player.team).id
        let position = fplElements.playerPosition
                               .find(x => x.id === player.element_type).singular_name
        
        return { name, team, teamId, position}
    }
  return (
    <div className="playerpop1">
        <div className="info-details">
            <span className='large'>{playerDetails().name}</span>
            <span className='small'>{playerDetails().team}</span>
			<span className='small'>{playerDetails().position}</span>
			<button
                onClick={onClick}
             className="btn-close btn-info btn-danger btn-player">
                <svg style={{color: 'white'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="white"></path> </svg>
      </button>
      </div>
      <div className="games-info">
        <div className="games-info-buttons">
				  <div
           className="btn btn-block btn-fpl btn-game-fixtures">Fixtures</div>
        </div>
        <div className="games-info-fixtures">
          <table className="table" style={{width: '100%'}}>
            <thead>
              <tr style={{background: bgColor === 1 ? `#ebff00` :
               bgColor === 2 ? '#00ff87' : bgColor === 3 ? '#05f0ff':'#e90052'}}>
                <th>Date</th>
                <th>GW</th>
                <th>Fixture</th>
                <th>FDR</th>
              </tr>
            </thead>
            <tbody className="t-fixtures">
              {loadOpponents(fixtures, events, playerDetails().teamId)
              .playerInfoOpp
              .map((x, idx) => {
                let teamName = x.arr[0].opponent === 0 ? 'None' : 
                teams.find(tname => tname.id === x.arr[0].opponent).name
                let color = x.arr[0].difficulty === 4 || x.arr[0].difficulty === 5 ? 
											'rgb(255,255,255)': 'rgb(0,0,0)'
                let backgroundColor = x.arr[0].difficulty === 2 ? 'rgb(1, 252, 122)' : 
											x.arr[0].difficulty === 3 ? 'rgb(231, 231, 231)' : x.arr[0].difficulty === 4 ?
											'rgb(255, 23, 81)' : x.arr[0].difficulty === 5 ? 'rgb(128, 7, 45)' : 'rgb(0,0,0)'
                return(
                  <tr key={idx}>
                    <td style={{fontWeight: 500}}>
                      {x.kickoff === '' ? '' : new Date(x.kickoff).toDateString()}
                    </td>
                    <td style={{fontWeight: 500}}>
                      {x.event}
                    </td>
                    <td style={{fontWeight: 500}}>
                      {teamName} &nbsp; {x.arr[0].venue}
                    </td>
                    <td style={{color: color, background: backgroundColor, fontWeight: 500}}>
                      {x.arr[0].difficulty}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        
        
      </div>
    </div>
  )
}

export default PlayerInfo