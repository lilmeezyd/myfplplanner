import { useEffect, useState } from 'react'

function SquadPlayer(props) {
    const { image, 
        backgroundColor, 
        color,playerOpps,  idx, player, teams , playerPos} = props
    const [ show, setShow ] = useState(false)
	const [ top, setTop ] = useState(window.innerHeight)
	const [ left, setleft ] = useState(window.innerWidth)

    const handleShow = () => setShow(true)
	const handleClose = () => setShow(false)
	const setDimensions = () => {
		setTop(window.innerHeight)
		setleft(window.innerWidth)
	}

    useEffect(() => {
		window.addEventListener('resize', setDimensions)
		return () => {
			window.removeEventListener('resize', setDimensions)
		}
	},[])

    let fromTop = (top-175)/2
	let fromLeft = (left-320)/2

  return (
    <>
    <div key={idx} className="pitch_unit">
        <div className="element_container">
            <div className="element_container_1 element_container-two">
                <button onClick={handleShow} type="button" className="btn-details">
                    <img src={require(`../static/shirt_${image}.webp`)} className="image_pic" alt={player.web_name}/>
                        <div className="details-cont">
                            <div className="data_name"
                                style={{backgroundColor:backgroundColor, color:color}}>{player.web_name}
                            </div>
                            <div className="data_fixtures x-small">
                                <div className="next-fix">{playerPos.selling_price}</div>
                                    <div className="up-fix">
                                        {playerOpps.map((opp, idx) => {
                                        return(
                                            <div key={idx}>
                                            {opp.arr.map((x, idx) => {
                                            let color = x.difficulty === 4 || x.difficulty === 5 ? 
                                                'rgb(255,255,255)': 'rgb(0,0,0)'
                                            let backgroundColor = x.difficulty === 2 ? 'rgb(1, 252, 122)' : 
                                                x.difficulty === 3 ? 'rgb(231, 231, 231)' : x.difficulty === 4 ?
                                                'rgb(255, 23, 81)' : x.difficulty === 5 ? 'rgb(128, 7, 45)' : 'rgb(0,0,0)'
                                            let name = x.opponent > 0 ? teams.filter(y => y.id === x.opponent)[0].short_name : ''
                                                return (
                                                    <span className='opponent' style={{color: color, backgroundColor: backgroundColor}} key={idx}>{name}{x.venue}</span>)
                                                })}
                                            </div>
                                            )
                                        })}
                                </div>
                                </div>
                                </div>
                </button>
                <button className="player-info-button player-info-pitch">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-square" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                </button>
                <button className="transfer-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                        </svg>
                </button>
                <button className="swap-button-out swap-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="darkred" className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                        </svg>
                </button>
                                </div>
                                </div> 
    </div>

    {show && <div onClick={handleClose} className="playerpopup"></div>}

    {show && <div className="playerpop" style={{top: fromTop, left: fromLeft}}>
        <div className="namesection small">
            <span>{player.first_name}&nbsp;{player.second_name}</span>
            <button onClick={handleClose} className="btn-info btn-close btn-danger"><svg style={{color: 'white'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="white"></path> </svg></button>
        </div>
        <div className="infobuttons">
            <button className="btn-info btn-info-block btn-danger transfer">Transfer</button>
            <button className="btn-info btn-info-block btn-warn substitute"></button>
            <button className="btn-info btn-info-block btn-cap ">Make Captain</button>
            <button className="btn-info btn-info-block btn-vcap " >Make Vice Captain</button>
            <button className="btn-info btn-info-block btn-light btn-player-info">View Information</button>
        </div> 
    </div>  }
</>
                        
  )
}

export default SquadPlayer