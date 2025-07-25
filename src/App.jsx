import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { NavBar } from './components/NavBar';
import { Link } from 'react-router-dom'
import { useUser } from './context/UserContext';
import Auth from './utils/auth';

function App() {
  const { currentUser, setCurrentUser } = useUser()
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
// 
  function logOut() {
    // Clear local state
    setUserData(null);
    // Clear UserContext
    setCurrentUser(null);
    // Clear token and redirect (Auth service handles this)
    Auth.logout();
  }
  useEffect(() => {
    const token = localStorage.getItem('id_token');
    if (token && currentUser) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/user/${currentUser.username}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          } else {
            setError("An error occurred while fetching user data");
          }
        } catch (error) {
          setError("An error occurred while fetching user data");
          console.error('An error occurred:', error);

        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    } else {
      setError("No token found");
      setLoading(false);
    }
  }, [currentUser]);
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <>
      <header>
        <div id='subheader'>
          <h1>SandboxShowcase</h1>
          {!userData &&
            <Link to='/login'>Login</Link>
          }

          {userData &&
          <>
            <p>Welcome, {userData.username}</p>
            <button onClick={() => logOut()}>Logout</button>
          </>
          }
        </div>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
