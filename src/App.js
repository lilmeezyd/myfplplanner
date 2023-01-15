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
      <Header />
      <BootstrapstaticProvider>
        <Main />
        <Fixtures />
      </BootstrapstaticProvider>
      <Footer />
    </>
  );
}

export default App;
