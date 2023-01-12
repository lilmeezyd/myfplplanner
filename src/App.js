import './App.css';
import './index.css';
import Header from './components/Header';
import Pitch from './components/Pitch';
import Players from './components/Players';
import Fixtures from './components/Fixtures';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <Pitch />
      <Players />
      <Fixtures />
      <Footer />
    </>
  );
}

export default App;
