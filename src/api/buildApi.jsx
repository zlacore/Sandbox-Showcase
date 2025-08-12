

const saveBuild = async (buildInfo) => {
    try {
        const token = localStorage.getItem('id_token')
        const response = await fetch('/api/build', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(buildInfo)
        })

        const data = await response.json()
        if (!response.ok) {
            throw new Error('User information not retrieved, check network tab!');
        }

        return data;
    } catch (err) {
        console.log('Error from user login: ', err);
        return Promise.reject('Could not fetch user info');
    }
};

const deleteBuild = async (publicId) => {
    try {
        const response = await fetch(`/api/build/${publicId}`, {
            method: 'DELETE'
        })

         const data = await response.json()
        if (!response.ok) {
            throw new Error('User information not retrieved, check network tab!');
        }

        return data;
    } catch (err) {
        console.log(`Could not delete build!`, err)
    }
}

const getBuilds = async () => {
    try {
        const token = localStorage.getItem('id_token')
        console.log('Token being sent:', token ? 'Token exists' : 'NO TOKEN FOUND');

        const response = await fetch('/api/build', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const data = await response.json()
        if (!response.ok) {
            throw new Error('Builds not retrieved, check network tab!');
        }

        return data;
    } catch (error) {
        console.log('Error from build query: ', error);
        return Promise.reject('Could not fetch builds!');
    }
}

const getBuildsByUser = async (username) => {
    try {
        const token = localStorage.getItem('id_token')
        console.log('Token being sent for getBuildsByUser:', token ? 'Token exists' : 'NO TOKEN FOUND');
        
        if (!token) {
            throw new Error('No authentication token found');
        }
        
        const response = await fetch(`/api/build/${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error('Builds not retrieved, check network tab!');
        }

        return data;
    } catch (error) {
        console.log('Error from build query: ', error);
        return Promise.reject('Could not fetch builds!');
    }
}
export { saveBuild, getBuilds, getBuildsByUser, deleteBuild }