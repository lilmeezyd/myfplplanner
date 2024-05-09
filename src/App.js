import './App.css';
import './index.css';
import { useState } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Fixtures from './components/Fixtures';
import Footer from './components/Footer';
import BootstrapstaticProvider from './BootstrapstaticContext';

function Welcome() {
  return (
    <div className="welcome">
      <p className='header'>Welcome To The Captain's FPL Planner</p>
      <p className='sub-header'>A look at what team you might assemble for future gameweeks</p>
    </div>
  )
}
function App() {
  const [showPop, setShowPop] = useState(false) 
  const handleShow = () => setShowPop(true)
  const handleClose = () => {
    setShowPop(false)
  }
  return (
    <>
    <BootstrapstaticProvider>
      <Header handleShow={handleShow} handleClose={handleClose} showPop={showPop} />
      {JSON.parse(localStorage.getItem('managerId')) > 0 ?
      
      <Main handleShow={handleShow} handleClose={handleClose} showPop={showPop} />
      : 
      <Welcome />}
      <Fixtures />
      <Footer />
      {showPop && <div className="playerpopup"></div>}
      </BootstrapstaticProvider>
    </>
  );
}

export default App;
