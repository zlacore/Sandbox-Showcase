import { useState, useEffect } from "react"
import { unlikeBuild } from "../api/buildApi"
import { likeBuild } from "../api/buildApi"
import { getComments } from "../api/commentApi"
import { commentOnBuild } from "../api/commentApi"
import { getLikedBuilds } from "../api/buildApi"
import { useUser } from "../context/UserContext"


export const BuildCard = ({ build }) => {
    const { currentUser } = useUser()
    const [showComments, setShowComments] = useState(false)
    const [buildComments, setBuildComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [likedBuilds, setLikedBuilds] = useState([])
    const [text, setText] = useState('')
    const isBuildLiked = likedBuilds.some(likedBuild => likedBuild.buildId === build.buildId)
    
    const displayComments = () => {
        return buildComments.map((comment, index) => {
            return (
                
                <div key={index} className='comment-div'>
                    <strong>{comment.user}:</strong> {comment.text}
                </div>
            )
        })
    }
    
    
    const refreshComments = async () => {
        const comments = await getComments(build.id)
        setBuildComments(comments)
    }

    const handleTextChange = (e) => {
        setText(e.target.value)
        console.log(text)
    }

    const handleComment = async () => {
        if (text.length < 1) {
            window.alert('Text field must not be empty')
            return 
        }
        setUploading(true)
        // console.log(formData)
        try {
            const res = await commentOnBuild({
                buildId: build.id,
                user: currentUser.username,
                text: text,
            })
            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            console.log(data)
        } catch (err) {
            // alert(err.message)
        } finally {
            setUploading(false)
            setText('')
            refreshComments()
        }
    }


    //  async function handleDeleteBuild(publicId) {
    //     console.log('Attempting to delete build with publicId: ', publicId)
    //     try {
    //         const res = await fetch(`/api/delete/${publicId}`, {
    //             method: 'DELETE',
    //         });

    //         if (!res.ok) throw new Error('Image deletion failed');

    //         const data = await res.json();
    //         console.log(data)
    //         await deleteBuild(
    //             publicId
    //         )
    //         await refreshBuilds()

    //         setBuildFeed((prev) => prev.filter((build) => build.publicId !== publicId))
    //     } catch (err) {
    //         alert(err.message);
    //     }

    // }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true)
                const comments = await getComments(build.id)
                console.log(comments)
                setBuildComments(comments)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchComments()
    }, [showComments])

    useEffect(() => {
        const fetchLikedBuilds = async () => {
            if (!currentUser) return
            try {
                const userLikedBuilds = await getLikedBuilds(currentUser.username)
                setLikedBuilds(userLikedBuilds)
            } catch (err) {
                console.error(err)
            }
        }
        fetchLikedBuilds()
    }, [])
    // TODO: Create build card component with ability to like and comment

    if (loading) {
        return <div>Loading...</div>;
    }

    // if (error) {
    //     console.log(error)
    //     return (<div className='centered'>
    //         <h1>{error}</h1>
    //     </div>)
    // }


    return (
        <>
            <h2>{build.title}</h2>
            <img className='build-img' src={build.url}></img>
            <h3>By: {build.user}</h3>
            <span>
                {
                    !isBuildLiked && (
                        <button onClick={() => likeBuild(currentUser.username, build.id)}>
                            Like
                        </button>
                    )
                }

                {
                    isBuildLiked && (
                        <button onClick={() => unlikeBuild(currentUser.username, build.uid)}>
                            Unlike
                        </button>
                    )
                }
                {
                    !showComments && (

                        <button onClick={() => setShowComments(true)}>
                            Show Comments
                        </button>
                    )
                }

                {
                    showComments && (
                        <>
                            <button onClick={() => setShowComments(false)}>
                                Hide Comments
                            </button>
                            <div>
                                <div id='upload-card'>
                                    <span>
                                        <label>Comment: </label> <input type="text" onChange={handleTextChange} value={text}/>
                                    </span>
                                </div>
                                <button onClick={() => handleComment()} disabled={uploading}>
                                    {uploading ? 'Posting...' : 'Post Comment'}
                                </button>
                            </div>
                            <div className='comment-container'>
                                {displayComments()}
                            </div>
                        </>
                    )
                }

            </span>
            {/* {currentUser?.username === 'zwilliam01' && (
                <button onClick={() => handleDeleteBuild(build.publicId)}>
                    Delete
                </button>
            )
            } */}
        </>

    )

}