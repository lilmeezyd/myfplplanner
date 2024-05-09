import React from 'react'
import Players from './Players'
import Pitch from './Pitch'

function Main(props) {
  const { handleShow, handleClose, showPop } = props
  return (
    <div className="main">
        <Pitch handleShow={handleShow} handleClose={handleClose} showPop={showPop} />
        {/*<Players handleShow={handleShow} handleClose={handleClose} showPop={showPop} />*/}
    </div>
  )
}

export default Main