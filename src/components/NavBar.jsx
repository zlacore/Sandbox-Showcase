import { Link } from "react-router-dom"
export const NavBar = () => {
    return (
        <>
            <nav>
                <Link to='/feed'
                    style={{
                        color: 'black'
                    }}
                >Feed</Link>
                <Link to='/profile'
                    style={{
                        color: 'black'
                    }}
                >Profile</Link>
                {/* <Link to='/upload'>Upload</Link> */}
            </nav>
        </>
    )
}