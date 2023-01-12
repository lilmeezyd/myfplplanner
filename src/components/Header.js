import React from 'react'
import { Button } from 'react-bootstrap'

function Header() {
  return (
    <nav id="myNav" className="topnav">
		<h4 className="logo">Fpl Gang</h4>
		<div className="links small">
			<Button size="sm" id="team_id">Team ID</Button>
		</div>
	</nav>
  )
}

export default Header