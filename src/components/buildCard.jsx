import { useState, useEffect } from "react"
import { unlikeBuild } from "../api/buildApi"
import { likeBuild } from "../api/buildApi"
import { getComments } from "../api/commentApi"
import { commentOnBuild } from "../api/commentApi"
import { getLikedBuilds } from "../api/buildApi"
import { useUser } from "../context/UserContext"
import { getOneBuild } from "../api/buildApi"
import { deleteComment } from "../api/commentApi"
///////////////////////////////////////////
/////////////////////////////////////////////
export const BuildCard = ({ build }) => {
    const { currentUser } = useUser()
    const [showComments, setShowComments] = useState(false)
    const [buildComments, setBuildComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [likedBuilds, setLikedBuilds] = useState([])
    const [text, setText] = useState('')
    const [localBuild, setLocalBuild] = useState(build)
    const [buildLikes, setBuildLikes] = useState(localBuild.likes)
    const [buildCommentCount, setBuildCommentCount] = useState(localBuild.commentCount)
    const isBuildLiked = likedBuilds.some(likedBuild => likedBuild.buildId === localBuild.id)

    const displayComments = () => {
        return buildComments.map((comment, index) => {
            return (

                <div key={index} className='comment-div'>
                    <span>
                        <strong>{comment.user}:</strong> {comment.text}
                        {
                            currentUser?.username === comment.user || currentUser?.username === 'zwilliam01'  && (

                                <button onClick={() => handleDeleteComment(comment.id)}>
                                    Delete
                                </button>
                            )
                        }

                    </span>
                </div>
            )
        })
    }

    const handleLikeBuild = async () => {
        try {
            const res = await likeBuild({
                user: currentUser.username,
                buildId: build.id
            })
            if (!res.ok) throw new Error('Failed to like build!');

            const data = await res.json();
            console.log(data)
        } catch (err) {
            // alert('Failed to like build!')
        } finally {
            refreshLikedBuilds()
            refreshBuild()
            setBuildLikes(prev => prev + 1)
        }
    }

    const refreshBuild = async () => {
        try {
            const res = await getOneBuild(localBuild.id)
            if (!res.ok) throw new Error('Failed to refresh build!');
            const data = await res.json()
            console.log('Singular build:', data)
            setLocalBuild(data)
        } catch (err) {
            console.log('Failed to refresh build!')
        }
    }

    const handleUnlikeBuild = async () => {

        if (!currentUser) return alert('Log in to like posts!')

        try {
            const res = await unlikeBuild({
                user: currentUser.username,
                buildId: build.id
            })
            if (!res.ok) throw new Error('Failed to unlike build!');

            const data = await res.json();
            console.log(data)
        } catch (err) {
            // alert('Failed to unlike build!')
        } finally {
            console.log('Running RefreshLikedBuilds() and refreshBuild()')
            refreshLikedBuilds()
            refreshBuild()
            setBuildLikes(prev => prev - 1)
        }
    }
    const refreshComments = async () => {
        const comments = await getComments(localBuild.id)
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
            setBuildCommentCount(prev => prev + 1)

        }
    }

    const handleDeleteComment = async (id) => {
        try {
            const res = await deleteComment({
                buildId: build.id,
                commentId: id
            })
            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            console.log(data)
        } catch (err) {
            // alert(err.message)
        } finally {
            setBuildCommentCount(prev => prev - 1)
            refreshComments()
        }
    }

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


    const refreshLikedBuilds = async () => {
        if (!currentUser) return
        try {
            const userLikedBuilds = await getLikedBuilds(currentUser.username)
            setLikedBuilds(userLikedBuilds)
            console.log('Liked builds: ', userLikedBuilds)
        } catch (err) {
            console.error(err)
        }
    }
    // useEffect(() => {
    //     refreshLikedBuilds()
    //     console.log(likedBuilds)
    // }, [localBuild])

    useEffect(() => {
        refreshLikedBuilds()
        console.log(likedBuilds)
    }, [currentUser]);
    // TODO: Create build card component with ability to like and comment

    useEffect(() => {
        setBuildLikes(localBuild.likes);
    }, [localBuild.likes]);
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
        <div className='build-card'>
            <h2>{localBuild.title}</h2>
            <img className='build-img' src={localBuild.url}></img>
            <h3>By: {localBuild.user}</h3>
            <h3>Likes: {buildLikes}</h3>
            <h3>Comments: {buildCommentCount}</h3>
            <span className="action-buttons" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {!isBuildLiked && (
                    <button onClick={handleLikeBuild}>Like</button>
                )}
                {isBuildLiked && (
                    <button onClick={handleUnlikeBuild}>Unlike</button>
                )}
                {!showComments && (
                    <button onClick={() => setShowComments(true)}>Show Comments</button>
                )}
                {showComments && (
                    <button onClick={() => setShowComments(false)}>Hide Comments</button>
                )}
            </span>

            {
                showComments && (
                    <>
                        <div id='comment-container'>
                            <div id='upload-card'>
                                <span style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <label>Comment: </label> <input type="text" onChange={handleTextChange} value={text} />
                                    <button onClick={() => handleComment()} disabled={uploading}>
                                        {uploading ? 'Posting...' : 'Post'}
                                    </button>
                                </span>
                            </div>
                        </div>
                        <div className='comment-container'>
                            {displayComments()}
                        </div>
                    </>
                )
            }

            {/* {currentUser?.username === 'zwilliam01' && (
                <button onClick={() => handleDeleteBuild(build.publicId)}>
                    Delete
                </button>
            )
            } */}
        </div>

    )

}
