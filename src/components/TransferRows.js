import { useContext } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'
import TransferBodyOut from './TransferBodyOut'
import TransferBodyIn from './TransferBodyIn'

function TransferRows() {
    const fplElements = useContext(BootstrapstaticContext)
    let pickIndex = fplElements.pickIndex

    const loadTransfers = () => {
        const newPlayersOut = []
        const newPlayersIn = []
        fplElements.playersOut[pickIndex-1].arr.forEach(x => {
            fplElements.players.forEach(y => { 
                if(y.id === x.element) {
                    newPlayersOut
                    .push({...x, element_type:y.element_type, web_name:y.web_name, team:y.team})
                }
            })
        })
        newPlayersOut.sort((a,b) => {
            if(a.element_type < b.element_type) return 1
		    if(a.element_type > b.element_type) return -1
        })

        fplElements.playersIn[pickIndex-1].arr.forEach(x => {
            fplElements.players.forEach(y => { 
                if(y.id === x.element) {
                    newPlayersIn
                    .push({...x, element_type:y.element_type, web_name:y.web_name, team:y.team})
                }
            })
        })
        newPlayersIn.sort((a,b) => {
            if(a.element_type < b.element_type) return 1
		    if(a.element_type > b.element_type) return -1
        })

        return { newPlayersOut, newPlayersIn }
    }
  return (
    <div className="transfer-rows">
        <div className="transfer-out-wrapper">
            <h4 className="small">Transfer Out</h4>
                <div className="transfer-out">
                    {loadTransfers().newPlayersOut.map((player, idx) => {
                        const teamObj = fplElements.teams.find(x => x.id === player.team)
                        let playerTeam = teamObj.name
                        let image = player.element_type === 1 ? `${teamObj.code}_1-66` : `${teamObj.code}-66`
                        return (
                            <TransferBodyOut 
                                idx={idx}
                                player={player}
                                playerTeam={playerTeam}
                                image={image} >
                            </TransferBodyOut>                        )
                    })}</div>
        </div>
        <div className="transfer-in-wrapper">
            <h4 className="small">Transfer In</h4>
                <div className="transfer-in">
                {loadTransfers().newPlayersIn.map((player, idx) => {
                        const teamObj = fplElements.teams.find(x => x.id === player.team)
                        let playerTeam = teamObj.name
                        let image = player.element_type === 1 ? `${teamObj.code}_1-66` : `${teamObj.code}-66`
                        return (
                            <TransferBodyIn 
                                idx={idx}
                                player={player}
                                playerTeam={playerTeam}
                                image={image} >
                            </TransferBodyIn>
                        )
                    })}
                </div>
        </div>
    </div>
  )
}

export default TransferRows