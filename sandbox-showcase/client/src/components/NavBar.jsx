import { Link } from "react-router-dom"
export const NavBar = () => {
    return (
        <>
            <nav>
                <Link to='/feed'>Feed</Link>
                <Link to='/login'>Login</Link>
                <Link to='/profile'>Profile</Link>
            </nav>
        </>
    )
}