import { useEffect, useState, useContext, useRef } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'
import PlayerInfo from './PlayerInfo'

function SquadPlayer(props) {

    const fplElements = useContext(BootstrapstaticContext)
    const outplayer = fplElements.outplayer
    const tempPlayersOut = fplElements.tempPlayersOut
    const inplayerOne = fplElements.inplayerOne
    const inplayerTwo = fplElements.inplayerTwo
    const playersSelected = fplElements.playersSelected()
    const picks = fplElements.picks
    const chips = fplElements.chips
    const eventId = fplElements.eventId
    const pickIndex = fplElements.pickIndex
    const { 
        handleShow, handleClose, showPop, image, 
        backgroundColor, 
        color,playerOpps, player, teams , playerPos,positionObj,
        playerInClass, curPage } = props
    const [ show, setShow ] = useState(false)
    const [ showInfo, setShowInfo ] = useState(false)
    const [ playerElement, setPlayerElement ] = useState(null)
    //const [ playerMultiplier, setPlayerMultiplier ] = useState(null)
   // const [ width, setWidth ] = useState(window.innerWidth)
    const [ swapArray, setSwapArray ] = useState([])
    const ref = useRef(null)
    const transferRef = useRef(null)

    

    const handleShowModal = () => {
        setShow(true)
        handleShow()
    }
	const handleCloseModal = () => {
        setShow(false)
        handleClose()
    }
    const handleShowInfo = () => {
        setShow(false)
        setShowInfo(true)
        handleShow()
    }
	const handleCloseInfo = () => {
        setShowInfo(false)
        handleClose()
    }

    useEffect(() => {
        let goal = document.getElementById('goal')
        let forw = document.getElementById('forw')
        let forwLength = forw.getElementsByClassName('pitch_unit').length
        let goalLength = goal.getElementsByClassName('pitch_unit').length
        if(forwLength === 1) {
            forw.getElementsByClassName('pitch_unit')[0].style.flexGrow = 0
        } else {
            Array.from(forw.getElementsByClassName('pitch_unit')).forEach(x =>
                x.style.flexGrow = 1)
        }
        if(goalLength === 1) {
            goal.getElementsByClassName('pitch_unit')[0].style.flexGrow = 0
        }
        Object.keys(outplayer).length > 0 && Object.keys(inplayerOne).length > 0 && fplElements.switchPlayers()

        Object.keys(outplayer).length === 0 && Object.keys(inplayerOne).length > 0 && Object.keys(inplayerTwo).length > 0 && fplElements.changeBenchOrder()

      

	}, [outplayer, inplayerOne, inplayerTwo, picks, pickIndex, playerElement,
        fplElements, playersSelected])

    useEffect(() => {
        let pPicks = document.querySelectorAll('.element_container_1')
        let noDefenders = picks[pickIndex-1].newPicks
                            .filter(x => x.element_type === 2 && x.multiplier !== 0).length
        let noMidfielders = picks[pickIndex-1].newPicks
                            .filter(x => x.element_type === 3 && x.multiplier !== 0).length
        let noForwards = picks[pickIndex-1].newPicks
                            .filter(x => x.element_type === 4 && x.multiplier !== 0).length
        const disablePlayers = (arr) => {
            Array.from(pPicks).forEach(x => {
                if(arr.includes(+x.id)) {
                    Array.from(x.getElementsByClassName('swap-button'))
                    .forEach(y => {
                        //width > 620 && (y.style.display = 'none')
                        y.parentElement.querySelector('.btn-details').style.opacity = 0.7
                })
                }
            }) }
        const addSwap = (arr) => {
            Array.from(pPicks).forEach(x => {
                if(arr.includes(+x.id)) {
                   x.parentElement.classList.add('swap')
                }
            })
        }    
        if(Object.keys(outplayer).length > 0) {
            let playerType = outplayer.element_type
            let playerId = outplayer.element
            if(playerType === 1) {
                const toDisable = picks[pickIndex-1].newPicks
                                        .filter(x => x.element_type !== 1)
                                        .map(x => x.element)
                const swap = picks[pickIndex-1].newPicks
                                .filter(x => x.element_type === 1 && x.position === 12)
                                .map(x => x.element)
                addSwap(swap)
                setSwapArray(toDisable)
                disablePlayers(toDisable)                          
            }
            if(playerType === 2) {
                if(noDefenders === 3) {
                    const toDisable = picks[pickIndex-1].newPicks
                                        .filter(x => (x.position < 12 && x.element !== playerId) || (x.position >= 12 && x.element_type !== 2))
                                        .map(x => x.element)
                    const swap = picks[pickIndex-1].newPicks
                                    .filter(x => x.element_type === 2 && x.position > 12)
                                    .map(x => x.element)
                    addSwap(swap)
                    setSwapArray(toDisable)
                    disablePlayers(toDisable)               
                } else {
                    const toDisable = picks[pickIndex-1].newPicks
                                        .filter(x => x.element_type === 1 || (x.position < 12 && x.element !== playerId))
                                        .map(x => x.element)
                    const swap = picks[pickIndex-1].newPicks
                                    .filter(x => x.element_type !== 1 && x.position > 12)
                                    .map(x => x.element)
                    addSwap(swap)
                    setSwapArray(toDisable)
                    disablePlayers(toDisable) 
                }
            }
            if(playerType === 3) {
                if(noMidfielders === 2) {
                    const toDisable = picks[pickIndex-1].newPicks
                                        .filter(x => x.element_type === 1 || (x.position < 12 && x.element !== playerId))
                                        .map(x => x.element)
                    const swap = picks[pickIndex-1].newPicks
                                    .filter(x => x.element_type === 3 && x.position > 12)
                                    .map(x => x.element)
                    addSwap(swap)
                    setSwapArray(toDisable)
                    disablePlayers(toDisable) 
                } else {
                    const toDisable = picks[pickIndex-1].newPicks
                                        .filter(x => x.element_type === 1 || (x.position < 12 && x.element !== playerId))
                                        .map(x => x.element)
                    const swap = picks[pickIndex-1].newPicks
                                    .filter(x => x.element_type !== 1 && x.position > 12)
                                    .map(x => x.element)
                    addSwap(swap)
                    setSwapArray(toDisable)
                    disablePlayers(toDisable) 
                } 
            }
            if(playerType === 4) {
                if(noForwards === 1) {
                    const toDisable = picks[pickIndex-1].newPicks
                                        .filter(x => (x.position < 12 && x.element !== playerId) || (x.position > 12 && x.element_type !== 4))
                                        .map(x => x.element)
                    const swap = picks[pickIndex-1].newPicks
                                    .filter(x => x.element_type === 4 && x.position > 12)
                                    .map(x => x.element)
                    addSwap(swap)
                    setSwapArray(toDisable)
                    disablePlayers(toDisable)               
                } else {
                    const toDisable = picks[pickIndex-1].newPicks
                                        .filter(x => x.element_type === 1 || (x.position < 12 && x.element !== playerId))
                                        .map(x => x.element)
                    const swap = picks[pickIndex-1].newPicks
                                    .filter(x => x.element_type !== 1 && x.position > 12)
                                    .map(x => x.element)
                    addSwap(swap)
                    setSwapArray(toDisable)
                    disablePlayers(toDisable) 
                }
            }
        } else {
            setSwapArray([])
            Array.from(pPicks).forEach(x => {
                x.parentElement.classList.remove('swap')
            })
        }
    },[outplayer, picks, pickIndex])    
    
    useEffect(() => {
        let pPicks = document.querySelectorAll('.element_container_1')
        let noDefenders = picks[pickIndex-1].newPicks
                            .filter(x => x.element_type === 2 && x.position < 12).length
        let noForwards = picks[pickIndex-1].newPicks
                            .filter(x => x.element_type === 4 && x.position < 12).length
        const disablePlayers = (arr) => {
            Array.from(pPicks).forEach(x => {
                if(arr.includes(+x.id)) {
                    Array.from(x.getElementsByClassName('swap-button'))
                    .forEach(y => {
                        //width > 620 && (y.style.display = 'none')
                        y.parentElement.querySelector('.btn-details').style.opacity = 0.7
                })
                }
            }) }
        const addSwap = (arr) => {
            Array.from(pPicks).forEach(x => {
                if(arr.includes(+x.id)) {
                    x.parentElement.classList.add('swap')
                }
            })
        }    
        if(Object.keys(inplayerOne).length > 0) {
            let playerType = inplayerOne.element_type
            let playerId = inplayerOne.element
            if(playerType === 1) {
                const toDisable = picks[pickIndex-1].newPicks
                                        .filter(x => (x.position > 12 && x.element !== playerId) || (x.position < 12 && x.element_type !== 1))
                                        .map(x => x.element)
                const swap = picks[pickIndex-1].newPicks
                                .filter(x => x.element_type === 1 && x.position < 12)
                                .map(x => x.element)
                addSwap(swap)
                setSwapArray(toDisable)
                disablePlayers(toDisable) 
            }
            if(playerType === 2) {
                if(noForwards === 1) {
                    const toDisable = picks[pickIndex-1].newPicks
                                        .filter(x => ((x.element_type === 4 && x.position < 12) || x.element_type === 1))
                                        .map(x => x.element)
                    const swap = picks[pickIndex-1].newPicks
                                    .filter(x => x.element !== playerId && ( (x.element_type !== 4 && x.element_type !== 1) || (x.position >= 12 && x.element_type !== 1)))
                                    .map(x => x.element)
                    addSwap(swap)
                    setSwapArray(toDisable)
                    disablePlayers(toDisable)
                } else {
                    const toDisable = picks[pickIndex-1].newPicks
                                        .filter(x => x.element_type === 1)
                                        .map(x => x.element)
                    const swap = picks[pickIndex-1].newPicks
                                    .filter(x => x.element !== playerId && x.element_type !== 1)
                                    .map(x => x.element)
                    addSwap(swap)
                    setSwapArray(toDisable)
                    disablePlayers(toDisable)
                }
            }
            if(playerType === 3) {
                if(noForwards === 1) {
                    const toDisable = picks[pickIndex-1].newPicks
                                        .filter(x => (x.element_type === 4 && x.position < 12) || x.element_type === 1)
                                        .map(x => x.element)
                    const swap = picks[pickIndex-1].newPicks
                                    .filter(x => x.element !== playerId && ((x.element_type !== 4 && x.element_type !== 1 )|| (x.position >= 12 && x.element_type !== 1)))
                                    .map(x => x.element)
                    addSwap(swap)
                    setSwapArray(toDisable)
                    disablePlayers(toDisable)
                } else if(noDefenders === 3) {
                    const toDisable = picks[pickIndex-1].newPicks
                                        .filter(x => (x.element_type === 2 && x.position < 12) || x.element_type === 1)
                                        .map(x => x.element)
                    const swap = picks[pickIndex-1].newPicks
                                    .filter(x => x.element !== playerId &&  ((x.element_type !== 2 && x.element_type !== 1) || (x.position >= 12 && x.element_type !== 1)))
                                    .map(x => x.element)
                    addSwap(swap)
                    setSwapArray(toDisable)
                    disablePlayers(toDisable)
                } else {
                    const toDisable = picks[pickIndex-1].newPicks
                                        .filter(x => x.element_type === 1)
                                        .map(x => x.element)
                    const swap = picks[pickIndex-1].newPicks
                                    .filter(x => (x.element_type !== 1 && x.position < 12)||(x.element !== playerId && x.element_type !== 1))
                                    .map(x => x.element)
                    addSwap(swap)
                    setSwapArray(toDisable)
                    disablePlayers(toDisable)
                }
            }
            if(playerType === 4) {
                if(noDefenders === 3) {
                    const toDisable = picks[pickIndex-1].newPicks
                                        .filter(x => (x.element_type === 2 && x.position < 12) || x.element_type === 1)
                                        .map(x => x.element)
                    const swap = picks[pickIndex-1].newPicks
                                    .filter(x => x.element !== playerId &&  ((x.element_type !== 2 && x.element_type !== 1) || (x.position >= 12 && x.element_type !== 1)))
                                    .map(x => x.element)
                    addSwap(swap)
                    setSwapArray(toDisable)
                    disablePlayers(toDisable)
                } else {
                    const toDisable = picks[pickIndex-1].newPicks
                                        .filter(x => x.element_type === 1)
                                        .map(x => x.element)
                    const swap  = picks[pickIndex-1].newPicks
                                    .filter(x => (x.element_type !== 1 && x.position < 12)||(x.element !== playerId && x.element_type !== 1))
                                    .map(x => x.element)
                    addSwap(swap)
                    setSwapArray(toDisable)
                    disablePlayers(toDisable)
                }
            }
        } else {
            setSwapArray([])
            Array.from(pPicks).forEach(x => {
                x.parentElement.classList.remove('swap')
            })
        }
    }, [inplayerOne, picks, pickIndex])
    const transferOut = (player) => {
        fplElements.addToTransfersOut(player)
        handleCloseModal()
    }
    const captain = (id) => {
        fplElements.changeCaptain(id)
        handleCloseModal()
    }

    const viceCaptain = (id) => {
        fplElements.changeViceCaptain(id)
        handleCloseModal()
    }

    const setSwitchPlayer = (player) => {

        setPlayerElement(player.element_type)
        //setPlayerMultiplier(player.multiplier)

        if(player.multiplier <= 0) {
            if(Object.keys(inplayerOne).length > 0) {
                handleCloseModal()
                return fplElements.getInPlayerTwo(player)
            }
            if(Object.keys(outplayer).length >= 0) {
                handleCloseModal()
                return fplElements.getInPlayerOne(player)
            }
        } else {
            fplElements.getOutPlayer(player)
            handleCloseModal()
        }
        
    }

    const cancelPlayer = (player) => {
        setPlayerElement(player.element_type)
        //setPlayerMultiplier(player.multiplier)
        fplElements.cancelPlayer(player)
        handleCloseModal()
    }

    const clickInfo = () => {
        handleCloseModal()
        handleShowInfo()
    }

  return (
    <>
   
    <div className={ ` pitch_unit`}>
                        {playerPos.multiplier === 0 ? <h3 className='bench_unit_heading'>
        <span className='bean tooltip'>
            {playerPos.position === 12 ? '' :
            playerPos.position === 13 ? '1.' : 
            playerPos.position === 14 ? '2.' : '3.'}&nbsp;{
        fplElements.playerPosition
                .find(x => x.id === +playerPos.element_type).singular_name_short}</span>
    </h3> : ''}
        <div className={`element_container ${(playerPos.element === fplElements.outplayer.element || playerPos.element === fplElements.inplayerOne.element)
                     ? 'player-active' : ''} ${playerInClass}`}>
            <div className="element_container_1 element_container-two"
            id={playerPos.element} position={positionObj.id} multiplier={playerPos.multiplier}>
                <button
                onClick={handleShowModal} type="button" 
                className={`btn-details`}
                style={{opacity:(Object.keys(outplayer).length === 0 && 
                    Object.keys(inplayerOne).length === 0 && 1)}}>
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
                <button
                    onClick={handleShowInfo}
                 className="player-info-button player-info-pitch">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-square" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                </button>
                {
                (Object.keys(outplayer).length === 0 && Object.keys(inplayerOne).length === 0) && 
                <button
                ref={transferRef}
                 onClick={() => transferOut(playerPos)} className="transfer-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                        </svg>
                </button>}
                {(tempPlayersOut.length === 0 && 
                !swapArray.includes(playerPos.element)) &&
                    <button
                    ref={ref}
                onClick={(playerPos.element === fplElements.outplayer.element || playerPos.element === fplElements.inplayerOne.element)
                    ? () => cancelPlayer(playerPos) : () => setSwitchPlayer(playerPos)} 
                    className={`${playerPos.multiplier === 0 ? 'swap-button-in' : 'swap-button-out'} swap-button`}>
                        {playerPos.multiplier > 0 ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="darkred" className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                        </svg> : 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="darkgreen" className="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                        </svg>} 
                </button>}
                
                <div className="captain">
                    {playerPos.is_captain && chips.tcap.event !== (+eventId+curPage) ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" role="img" focusable="false" className="captain">
                            <title>Captain</title><circle cx="12" cy="12" r="12" aria-hidden="true"></circle>
	    <path d="M15.0769667,14.370341 C14.4472145,15.2780796 13.4066319,15.8124328 12.3019667,15.795341 C10.4380057,15.795341 8.92696674,14.284302 8.92696674,12.420341 C8.92696674,10.55638 10.4380057,9.045341 12.3019667,9.045341 C13.3988206,9.06061696 14.42546,9.58781014 15.0769667,10.470341 L17.2519667,8.295341 C15.3643505,6.02401882 12.1615491,5.35094208 9.51934028,6.67031017 C6.87713147,7.98967826 5.49079334,10.954309 6.17225952,13.8279136 C6.8537257,16.7015182 9.42367333,18.7279285 12.3769667,18.720341 C14.2708124,18.7262708 16.0646133,17.8707658 17.2519667,16.395341 L15.0769667,14.370341 Z" fill="#fff" aria-hidden="true"></path>
	</svg> : playerPos.is_vice_captain &&  chips.tcap.event !== (+eventId+curPage) ? <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" role="img" focusable="false" className="vice-captain">
	<title>Captain</title><circle cx="12" cy="12" r="12" aria-hidden="true"></circle><polygon points="13.5 .375 8.925 12.375 4.65 12.375 0 .375 3.15 .375 6.75 10.05 10.35 .375" transform="translate(5.25 6)" fill="#fff" aria-hidden="true"></polygon>
	</svg> : playerPos.is_captain && chips.tcap.event === (+eventId+curPage) ? 
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" role="img" focusable="false" className="captain">
	<title>Captain</title><circle cx="12" cy="12" r="12" aria-hidden="true" fill="white"></circle>
	<path d="M15.0769667,14.370341 C14.4472145,15.2780796 13.4066319,15.8124328 12.3019667,15.795341 C10.4380057,15.795341 8.92696674,14.284302 8.92696674,12.420341 C8.92696674,10.55638 10.4380057,9.045341 12.3019667,9.045341 C13.3988206,9.06061696 14.42546,9.58781014 15.0769667,10.470341 L17.2519667,8.295341 C15.3643505,6.02401882 12.1615491,5.35094208 9.51934028,6.67031017 C6.87713147,7.98967826 5.49079334,10.954309 6.17225952,13.8279136 C6.8537257,16.7015182 9.42367333,18.7279285 12.3769667,18.720341 C14.2708124,18.7262708 16.0646133,17.8707658 17.2519667,16.395341 L15.0769667,14.370341 Z" fill="#000" aria-hidden="true"></path>
	</svg> : playerPos.is_vice_captain && chips.tcap.event === (+eventId+curPage) ?
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" role="img" focusable="false" className="vice-captain">
	<title>Captain</title><circle cx="12" cy="12" r="12" aria-hidden="true" fill="white"></circle><polygon points="13.5 .375 8.925 12.375 4.65 12.375 0 .375 3.15 .375 6.75 10.05 10.35 .375" transform="translate(5.25 6)" fill="#000" aria-hidden="true"></polygon>
	</svg> : ''}</div>
                                </div>
                                </div> 
    </div>

    

    
    
    {show && showPop &&
    <div className="playerpop">
        <div className="namesection">
            <span>{player.first_name}&nbsp;{player.second_name}</span>
            <button onClick={handleCloseModal} className="btn-info btn-close btn-danger ns-btn"><svg style={{color: 'white'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="white"></path> </svg></button>
        </div>
        <div className="infobuttons">
            {
                (Object.keys(outplayer).length === 0 && Object.keys(inplayerOne).length === 0) &&
                 <button onClick={() => transferOut(playerPos)} 
            className={`btn-info btn-info-block small
            ${fplElements.playersOut[pickIndex-1].arr.some(x => x.element === playerPos.element) ?
                'btn-green':'btn-danger'}
                ${(playerPos.element === fplElements.outplayer.element || playerPos.element === fplElements.inplayerOne.element) ? 'hide-btn':'show-btn'}  transfer`}>
                {fplElements.playersOut[pickIndex-1].arr.some(x => x.element === playerPos.element) ?
                    'Restore':'Remove'}</button>}
            {(tempPlayersOut.length === 0 && 
            !swapArray.includes(playerPos.element)) && <button className={`btn-info btn-info-block 
            ${fplElements.playersOut[pickIndex-1].arr.some(x => x.element === playerPos.element) ?
                'hide-btn':'show-btn'} btn-warn substitute small`}
                onClick={(playerPos.element === fplElements.outplayer.element || playerPos.element === fplElements.inplayerOne.element)
                    ? () => cancelPlayer(playerPos) : () => setSwitchPlayer(playerPos)}>
                    {(playerPos.element === fplElements.outplayer.element || playerPos.element === fplElements.inplayerOne.element)
                     ? 'Cancel' : 'Switch'}
                </button>}
            {tempPlayersOut.length === 0 &&
            (Object.keys(outplayer).length === 0 && Object.keys(inplayerOne).length === 0) && <button className={`btn-info btn-info-block small
            ${fplElements.playersOut[pickIndex-1].arr.some(x => x.element === playerPos.element) ?
                'hide-btn':'show-btn'} 
                ${playerPos.multiplier > 0 ? 'show-btn':'hide-btn'} 
                ${(playerPos.element === fplElements.outplayer.element || playerPos.element === fplElements.inplayerOne.element) ? 'hide-btn':'show-btn'} btn-cap `}
                onClick={() => captain(playerPos.element)}>Make Captain</button>}
            {tempPlayersOut.length === 0 &&
            (Object.keys(outplayer).length === 0 && Object.keys(inplayerOne).length === 0) && <button className={`btn-info btn-info-block small
            ${fplElements.playersOut[pickIndex-1].arr.some(x => x.element === playerPos.element) ?
                'hide-btn':'show-btn'}
                ${playerPos.multiplier > 0 ? 'show-btn':'hide-btn'} 
                ${(playerPos.element === fplElements.outplayer.element || playerPos.element === fplElements.inplayerOne.element) ? 'hide-btn':'show-btn'} btn-vcap `} 
                onClick={() => viceCaptain(playerPos.element)}>Make Vice Captain</button>}
            <button 
            onClick={clickInfo}
            className={`btn-info btn-info-block btn-light small
            ${fplElements.playersOut[pickIndex-1].arr.some(x => x.element === playerPos.element) ?
                'hide-btn':'show-btn'} 
            ${(playerPos.element === fplElements.outplayer.element || playerPos.element === fplElements.inplayerOne.element) ? 'hide-btn':'show-btn'} btn-player-info`}>View Information</button>
        </div> 
    </div>  }
    
     {showInfo && showPop &&
    <PlayerInfo
        playerPos={playerPos.element}
        bgColor={playerPos.element_type}
        onClick={handleCloseInfo}>
    </PlayerInfo>
    }

    
    
</>
                        
  )
}

export default SquadPlayer