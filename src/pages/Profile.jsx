import { getBuildsByUser, deleteBuild } from "../api/buildApi";
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

    async function handleDeleteBuild(publicId) {
        console.log('Attempting to delete build with publicId: ', publicId)
        try {
            const res = await fetch(`/api/delete/${publicId}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Image deletion failed');

            const data = await res.json();
            console.log(data)
            await deleteBuild(
                publicId
            )
            await refreshBuilds()

            setBuildFeed((prev) => prev.filter((build) => build.publicId !== publicId))
        } catch (err) {
            alert(err.message);
        }

    }
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

    const refreshBuilds = async () => {
        if (!currentUser || !currentUser.username) return;
        setLoading(true);
        try {
            const builds = await getBuildsByUser(currentUser.username);
            setBuildFeed(builds);
        } catch (err) {
            setError('Failed to load builds');
        } finally {
            setLoading(false);
        }
    };
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
                    <button onClick={() => handleDeleteBuild(build.publicId)}>
                        Delete
                    </button>
                </div>
            )
        })
    }
    useEffect(() => {

        if (!currentUser || !currentUser.username) return
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
        }
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        console.log(error)
        return (<div className='centered'>
            <h1>{error}</h1>
        </div>)
    }

    return (
        <>
            <div className='centered'>

                {
                    !currentUser && (
                        <h1>
                            Sign in to upload your cool builds!
                        </h1>
                    )
                }

                {
                    currentUser && (
                        <>
                            <div>
                                <h1>Your builds</h1>
                                <ImageUpload onUploadSuccess={refreshBuilds}></ImageUpload>
                            </div>
                            <div id='feed-div'>
                                {renderBuilds()}
                            </div>
                        </>

                    )
                }
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