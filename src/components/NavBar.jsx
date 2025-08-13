import { Link } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { useState } from "react";
import Auth from "../utils/auth";
export const NavBar = () => {
    const [userData, setUserData] = useState(null);
    const { currentUser, setCurrentUser } = useUser()

    function logOut() {
        // Clear local state
        setUserData(null);
        // Clear UserContext
        setCurrentUser(null);
        // Clear token and redirect (Auth service handles this)
        Auth.logout();
    }
    return (
        <>
            <nav>
                <Link to='/feed'
                    style={{
                        color: 'black'
                    }}
                >Feed</Link>
                {
                    !currentUser && (
                        <Link to='/login'
                            style={{
                                color: 'black'
                            }}
                        >Login</Link>
                    )
                }

                {
                    currentUser && (
                        <button onClick={() => logOut()}>Logout</button>
                    )
                }
                <Link to='/profile'
                    style={{
                        color: 'black'
                    }}
                >Profile</Link>
            </nav>
        </>
    )
}