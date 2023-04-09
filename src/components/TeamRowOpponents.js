import React from 'react'

function TeamRowOpponents(props) {
    const { color, backgroundColor, name, venue} = props
  return (
    <span className='opponent' style={{color: color, backgroundColor: backgroundColor}}>{name}{venue}</span>
  )
}

export default TeamRowOpponents