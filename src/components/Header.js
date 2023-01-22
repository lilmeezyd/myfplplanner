import { useState, useEffect, useContext } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'
import { Button } from 'react-bootstrap'

function Header() {


	const [ show, setShow ] = useState(false)
	const [ top, setTop ] = useState(window.innerHeight)
	const [ left, setleft ] = useState(window.innerWidth)
	const [ managerId, setManagerId ] = useState('')

	const fplManager = useContext(BootstrapstaticContext)

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

	const getManagerId = (e) => {
		e.preventDefault()
		fplManager.getManagerInfo(managerId)
		localStorage.removeItem('managerId')
		localStorage.setItem('managerId', JSON.stringify(managerId))
		handleClose()
		e.target.value = ''
	}

	
	let fromTop = (top-175)/2
	let fromLeft = (left-320)/2

  return (
	<>
    <nav id="myNav" className="topnav">
		<h4 className="logo">Hi,&nbsp;
			{fplManager.managerInfo.player_first_name === undefined ? 'Fpl Gang' : fplManager.managerInfo.player_first_name}</h4>
		<div className="links small">
			<Button onClick={handleShow} size="sm" id="team_id">Team ID</Button>
		</div>
	</nav>
	{show && <div onClick={handleClose} className="playerpopup"></div>}
	{show && <div style={{top: fromTop, left: fromLeft}} id="modal">
		<form onSubmit={getManagerId} name="team">
			<label htmlFor="team">Team ID</label>
			<input onChange={(e) => setManagerId(+e.target.value)} type="number" id="teamid" required/>
			<button type="submit" className="btn btn-block btn-fpl">Load</button>
		</form>
		<button onClick={handleClose} className="btn-info btn-close btn-danger" id="close_modal">X</button>
	</div>}
	</>
  )
}

export default Header