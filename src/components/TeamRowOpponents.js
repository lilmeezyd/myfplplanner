import React from 'react'

function TeamRowOpponents(props) {
    const { color, backgroundColor, name, venue} = props
  return (
    <>
    {/*<TeamRowOpponents
                            key={x.opponent}
                            color={
                              x.difficulty === 4 || x.difficulty === 5
                                ? "rgb(255,255,255)"
                                : "rgb(0,0,0)"
                            }
                            backgroundColor={
                              x.difficulty === 2
                                ? "rgb(1, 252, 122)"
                                : x.difficulty === 3
                                ? "rgb(231, 231, 231)"
                                : x.difficulty === 4
                                ? "rgb(255, 23, 81)"
                                : x.difficulty === 5
                                ? "rgb(128, 7, 45)"
                                : "rgb(0,0,0)"
                            }
                            name={
                              x.opponent > 0
                                ? teams.filter((y) => y.id === x.opponent)[0].short_name
                                : ""
                            }
                            venue={x.venue}
                          />*/}
    <span className='opponent' style={{color: color, backgroundColor: backgroundColor}}>{name}{venue}</span>
    </>
  )
}

export default TeamRowOpponents