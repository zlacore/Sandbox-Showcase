import { getBuilds } from '../api/buildApi'
import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { deleteBuild } from '../api/buildApi'
import { BuildCard } from '../components/buildCard'
const Feed = () => {
    const [buildFeed, setBuildFeed] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { currentUser } = useUser()
    useEffect(() => {
        const fetchBuilds = async () => {
            try {
                setLoading(true)
                const builds = await getBuilds()
                console.log('Fetched builds:', builds)
                setBuildFeed(builds)
            } catch (err) {
                console.error('Error fetching builds:', err)
                setError('Failed to load builds')
            } finally {
                setLoading(false)
            }
        }
        fetchBuilds()
    }, [])

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

    function renderBuilds() {
        if (loading) return <p>Loading builds...</p>
        if (error) return <p>Error: {error}</p>
        if (buildFeed.length === 0) return <p>No builds found</p>
        return buildFeed.map((build) => {
            return (
                <div className='build-container'>
                    
                    <BuildCard build={build} />
                    {currentUser?.username === 'zwilliam01' && (
                        <button onClick={() => handleDeleteBuild(build.publicId)}>
                            Delete
                        </button>
                    )
                }
                </div>
            )
        })
    }
    return (


        <>
            <div id='feed'>
                <div className='centered'>
                    <div>
                        <h1>Build Feed</h1>
                    </div>
                    <div id='feed-div'>
                        {renderBuilds()}
                    </div>
                </div >
            </div>
        </>
    )
}

export default Feed