import { Outlet } from 'react-router-dom';
import './App.css';
import { NavBar } from './components/NavBar';
 function App() {
  return (
    <>
    <header>
      <h1>SandboxShowcase</h1>
    <NavBar />
    </header>
    <main>
      <Outlet/>
    </main>
    </>
  );
}

export default App;
