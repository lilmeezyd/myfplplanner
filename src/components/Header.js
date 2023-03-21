import { useState, useContext } from 'react'
import { BootstrapstaticContext } from '../BootstrapstaticContext'
import { Button } from 'react-bootstrap'

function Header(props) {


	const [ show, setShow ] = useState(false)
	const [ managerId, setManagerId ] = useState('')

	const fplManager = useContext(BootstrapstaticContext)

	const { handleShow, handleClose, showPop } = props
	const arrow = fplManager.colorOfArrow()

	const handleShowModal = () => {
		setShow(true)
		handleShow()
	}
	const handleCloseModal = () => {
		setShow(false)
		handleClose()
	}
	

	const getManagerId = (e) => {
		e.preventDefault()
		fplManager.getManagerInfo(managerId)
		localStorage.removeItem('managerId')
		localStorage.setItem('managerId', JSON.stringify(managerId))
		handleCloseModal()
		e.target.value = ''
	}


  return (
	<>
    <nav id="myNav" className="topnav">
		<h4 className="logo">Hi,&nbsp;
			{fplManager.managerInfo.player_first_name === undefined ? 'Fpl Gang' : fplManager.managerInfo.player_first_name}</h4>
		<div className="tname-details large">
			<span className="theading">Name</span>
			<h4 className="tname">{fplManager.managerInfo.name}</h4>
		</div>
		<div className="trank-details large">
			<span className="theading">OR</span>
				<div>
					<h4 className="trank">
					{fplManager.managerInfo.summary_overall_rank}
					</h4>
				<div className="arrow">
					{arrow === 'green' ? 
					<svg xmlns="http://www.w3.org/2000/svg" fill="green" height="24" width="24"><path d="m7 14 5-5.025L17 14Z"/></svg> : 
					arrow === 'red' ? 
					<svg xmlns="http://www.w3.org/2000/svg" fill="red" height="24" width="24"><path d="m12 15-5-4.975h10Z"/></svg> : 
					<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="grey" className="bi bi-circle-fill" viewBox="0 0 12 12">
						 <circle cx="6" cy="6" r="6"/>
					</svg>}
				</div>
				</div>
			</div>
		<div className="links small">
			<Button onClick={handleShowModal} size="sm" id="team_id">Team ID</Button>
		</div>
	</nav>
	{show && showPop && <div id="modal">
		<form onSubmit={getManagerId} name="team">
			<label htmlFor="team">Team ID</label>
			<input onChange={(e) => setManagerId(+e.target.value)} type="number" id="teamid" required/>
			<button type="submit" className="btn btn-block btn-fpl">Load</button>
		</form>
		<button onClick={handleCloseModal} className="btn-info btn-close btn-danger" id="close_modal"><svg style={{color: 'white'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="white"></path> </svg></button>
	</div>}
	</>
  )
}

export default Header