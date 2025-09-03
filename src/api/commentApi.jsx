

export const commentOnBuild = async (commentInfo) => {
    // POST
    try {
        const response = await fetch('/api/comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentInfo)
        })

        const data = await response.json()
        if (!response.ok) {
            throw new Error ('Could not post comment!')
        }
        return data
    } catch (err) {
        console.error(err)
    }   
}

export const deleteComment = async (commentInfo) => {
    // DELETE
    try {
        const response = await fetch('/api/comment', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentInfo)
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error ('Could not delete comment!')
        }
        return data
    } catch (err) {
        console.error(err)
    }
}

export const getComments = async (buildId) => {
    try {
        const response = await fetch(`/api/comment/${buildId}`, {
            method: 'GET',
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error ('Could not get comments!')
        }
        console.log(data)
        return data
    } catch (err) {
        console.error(err)
    }
}