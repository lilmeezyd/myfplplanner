import './App.css';
import './index.css';
import Header from './components/Header';
import Main from './components/Main';
import Fixtures from './components/Fixtures';
import Footer from './components/Footer';
import BootstrapstaticProvider from './BootstrapstaticContext';

function App() {
  return (
    <>
    <BootstrapstaticProvider>
      <Header />  
      <Main />
      <Fixtures />
      <Footer />
      </BootstrapstaticProvider>
    </>
  );
}

export default App;
