import {  useContext, useState } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'
import PlayerInfo from './PlayerInfo'

function PlayerCard(props) {

  const { 
    idx, backgroundColor, color, forwardImage, playerPos, shortName, shortPos,
    position, team, sort, handleShow, handleClose, showPop
   } = props
    const fplElements = useContext(BootstrapstaticContext)
    const players = fplElements.players
    const pickIndex = fplElements.pickIndex
    const picks = fplElements.picks
    let playersSelected = fplElements.playersSelected()
    let goalkeepersSelected = fplElements.goalkeepersSelected()
    let defendersSelected = fplElements.defendersSelected()
    let midfieldersSelected = fplElements.midfieldersSelected()
    let forwardsSelected = fplElements.forwardsSelected()
    const [ showInfo, setShowInfo ] = useState(false)
    const [ showTransfer, setShowTransfer ] = useState(false)

    const handleShowInfo = () => {
      setShowInfo(true)
      handleShow()
  }

    const handleCloseInfo = () => {
      setShowInfo(false)
      handleClose()
  }

  const handleShowTransfer = () => {
    setShowTransfer(true)
    handleShow()
  }
  const handleCloseTransfer = () => {
    setShowTransfer(false)
    handleClose()
  }
  

    const transferIn = (player, positiion, team) => {
      fplElements.addToTransfersIn(player, positiion, team)
      fplElements.addedPlayer(team, player)
      handleCloseTransfer()
  }
    const playerIds = () => {
      let ids = picks[pickIndex-1].newPicks.map(x => x.element)
      return ids
    }
  return (
    <>
    <tr key={idx} className="player-tbh">
    <td className="info">
        <button
        onClick={handleShowInfo}
         style={{backgroundColor: backgroundColor, color: color}} className="player-info-button-table">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-square" viewBox="0 0 16 16">
  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
 </svg>
        </button>
    </td>
    <td className="player">
        <button
          disabled={picks.length && playerIds().includes(playerPos.id)}
          onClick={handleShowTransfer} className="player-cell btn-table">
            <div className="images">
            <img src={require(`../static/shirt_${forwardImage}.webp`)} alt={forwardImage} />
            </div>
            <div className="player-cell-info small">
                <span className="name">{playerPos.web_name}</span>
                <div className="player-cell-details">
                    <span className="name">{shortName}</span>
                    <span className="position">{shortPos}</span>
                </div>
            </div>
        </button>
    </td>
    <td><span className="price">{(playerPos.now_cost/10).toFixed(1)}</span></td>
    <td><span className="points">{sort === 'event_points' ? playerPos.event_points : playerPos.total_points}</span></td>
</tr>

{showTransfer && showPop && 
  <div className="playerpop">
    <div className="namesection small">
        <span>{playerPos.first_name}&nbsp;{playerPos.second_name}</span>
        <button onClick={handleCloseTransfer} className="btn-info btn-close btn-danger"><svg style={{color: 'white'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="white"></path> </svg></button>
    </div>
    {playersSelected === 15 && <div className='message small danger'>
        <span>Maximum Players Selected</span>
      </div>}
      {playersSelected < 15 && 
      playerPos.element_type === 1 && 
      goalkeepersSelected === 2 && <div className='message small danger'>
        <span>Maximum Goalkeepers Selected</span>
        </div>}
        {playersSelected < 15 && 
      playerPos.element_type === 2 && 
      defendersSelected === 5 && <div className='message small danger'>
        <span>Maximum Defenders Selected</span>
        </div>}
        {playersSelected < 15 && 
      playerPos.element_type === 3 && 
      midfieldersSelected === 5 && <div className='message small danger'>
        <span>Maximum Midfielders Selected</span>
        </div>}
        {playersSelected < 15 && 
      playerPos.element_type === 4 && 
      forwardsSelected === 3 && <div className='message small danger'>
        <span>Maximum Forwards Selected</span>
        </div>}
    <div className="infobuttons">
      {((playersSelected < 15 &&
      playerPos.element_type === 1 && goalkeepersSelected < 2) ||
      (playersSelected < 15 &&
        playerPos.element_type === 2 && defendersSelected < 5) ||
        (playersSelected < 15 &&
          playerPos.element_type === 3 && midfieldersSelected < 5) ||
          (playersSelected < 15 &&
            playerPos.element_type === 4 && forwardsSelected < 3))&& <button
         onClick={() => transferIn(playerPos.id, position, team)} className='btn-info btn-info-block btn-green'>Add Player</button>}
    </div>
  </div>}

{showInfo && showPop &&
  <PlayerInfo
      playerPos={playerPos.id}
      bgColor={playerPos.element_type}
      onClick={handleCloseInfo}>
  </PlayerInfo>
  }
  </>
  )
}

export default PlayerCard