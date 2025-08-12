import { getBuildsByUser } from "../api/buildApi";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import '../index.css'
import ImageUpload from "../components/UploadButton";
export const ProfilePage = () => {

    // import  React, { useState, useEffect } from 'react';
    // export const ProfilePage: React.FC = () => {

    const { currentUser } = useUser();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buildFeed, setBuildFeed] = useState([])

    useEffect(() => {
        const fetchBuildsByUser = async () => {
            // Check if currentUser exists before trying to access username
            if (!currentUser || !currentUser.username) {
                console.log('No current user found, skipping build fetch');
                setLoading(false);
                return;
            }
            
            const username = currentUser.username
            console.log('Current user:', currentUser)
            try {
                setLoading(true)
                const builds = await getBuildsByUser(username)
                console.log('Fetched builds:', builds)
                setBuildFeed(builds)
            } catch (err) {
                console.error('Error fetching builds:', err)
                setError('Failed to load builds')
            } finally {
                setLoading(false)
            }
        }
        fetchBuildsByUser()
    }, [currentUser]) // ✅ Add currentUser as dependency

    function renderBuilds() {
        if (loading) return <p>Loading builds...</p>
        if (error) return <p>Error: {error}</p>
        if (buildFeed.length === 0) return <p>No builds found</p>
        return buildFeed.map((build) => {
            return (
                <div key={build.id} className='build-card'>
                    <h3>{build.title}</h3>
                    <img src={build.url} alt={build.title} style={{ maxWidth: '300px' }}></img>
                    <p>{build.description}</p>
                    <p>By: {currentUser.username}</p>
                </div>
            )
        })
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        console.log(error)
        return (<div className='centered'>
            <h1>Sign in to upload builds!</h1>
        </div>)
    }

    return (
        <>
            <div className='centered'>
                <div>
                    <h1>Your builds</h1>
                    <ImageUpload></ImageUpload>
                </div>
                    <div id='feed-div'>
                        {renderBuilds()}
                    </div>
            </div >
        </>
    );;
}

{/* <div className='card'>
    <h2>Pull</h2>
    <div>
        <p>Back and biceps</p>
       
    </div>
</div>
<div className='card'>
    <h2>Legs</h2>
    <div>
        <p>Quads, hammies and glutes</p>
        
    </div>
</div> */}
{/* <div className='card'>
    <h2>Lunch</h2>
    <div>
        <p>Lunches</p>
        
    </div>
</div>
<div className='card'>
    <h2>Dinner</h2>
    <div>
        <p>Dinners</p>
       
    </div>
</div> */}