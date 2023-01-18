import {  useContext } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'

function playerCard(props) {

    const fplElements = useContext(BootstrapstaticContext)
    const players = fplElements.players
  return (
    <div>playerCard</div>
  )
}

export default playerCard