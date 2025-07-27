import { getBuilds } from '../api/buildApi'
import { useState, useEffect } from 'react'
const Feed = () => {
    const [buildFeed, setBuildFeed] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
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
                    <p>By: {build.user}</p>
                </div>
            )
        })
    }
    return (


        <>
            <div id='feed'>

                <div id='feedsearch'>
                    <h1>Build Feed</h1>


                    {/* <span>
            In future, add ability to search and filter
            <input></input>
            <button></button>
            </span> */}
                </div>
                <div id='feed-div'>
                    {renderBuilds()}
                </div>
            </div>
        </>
    )
}

export default Feed