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
          <img src='./sandboxshowcaseattempt1.png'
          style={{
            position: 'relative',
            left: '20px',
            width: '600px',
            height: '120px',
            // marginLeft: '0',
            // marginRight: 'auto',
            zIndex: '3'
          }}
          >
          </img>
          {!userData &&
            <Link to='/login'
            style={{
              color: 'black',
              position: 'absolute',
              right: '600px',
              top: '72px'
            }}
            >Login</Link>
          }

          {userData &&
          <>
            <h3 
            style={{
              color: 'black'
            }}
            >Welcome, {userData.username}</h3>
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
