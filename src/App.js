import './App.css';
import './index.css';
import { useState } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Fixtures from './components/Fixtures';
import Footer from './components/Footer';
import BootstrapstaticProvider from './BootstrapstaticContext';

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
      <Main handleShow={handleShow} handleClose={handleClose} showPop={showPop} />
      <Fixtures />
      <Footer />
      {showPop && <div className="playerpopup"></div>}
      </BootstrapstaticProvider>
    </>
  );
}

export default App;
