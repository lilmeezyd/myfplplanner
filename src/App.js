import './App.css';
import './index.css';
import { useContext, useState } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Fixtures from './components/Fixtures';
import Footer from './components/Footer';
import BootstrapstaticProvider, { BootstrapstaticContext } from './BootstrapstaticContext';

function Welcome() {
  return (
    <p className="welcome">Welcome To The Captain's FPL Planner</p>
  )
}
function App() {
  const fplManager = useContext(BootstrapstaticContext)
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
      <Main handleShow={handleShow} handleClose={handleClose} showPop={showPop} /> : 
      <Welcome />}
      
      <Fixtures />
      <Footer />
      {showPop && <div className="playerpopup"></div>}
      </BootstrapstaticProvider>
    </>
  );
}

export default App;
