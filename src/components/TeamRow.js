import React from 'react'
import TeamRowOpponents from './TeamRowOpponents'

function TeamRow(props) {

    const { opponents, team, teams } = props
  return (
    <tr>
        <td>
            <span className="ticker-image">
                <img src={require(`../static/t${team.code}.png`)} alt={team.name} />
            </span>
            <span className="ticker-team">{team.name}</span>
        </td>
        {opponents.map((cell) => {
            return (
            <td key={cell.event}>
                <div className="oppfix">
                    {cell.arr.map((x, idx) => {
                        let color = x.difficulty === 4 || x.difficulty === 5 ? 
                        'rgb(255,255,255)': 'rgb(0,0,0)'
                        let backgroundColor = x.difficulty === 2 ? 'rgb(1, 252, 122)' : 
                        x.difficulty === 3 ? 'rgb(231, 231, 231)' : x.difficulty === 4 ?
                        'rgb(255, 23, 81)' : x.difficulty === 5 ? 'rgb(128, 7, 45)' : 'rgb(0,0,0)'
                        let name =  x.opponent > 0 ? teams.filter(y => y.id === x.opponent)[0].short_name : ''
                        return (
                            <TeamRowOpponents  key={x.opponent}
                            color={color}
                            backgroundColor={backgroundColor}
                            name={name}
                            venue={x.venue} />
                            )
                })}
            </div></td>)
        })}
    </tr>
  )
}

export default TeamRow