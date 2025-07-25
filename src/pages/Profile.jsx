import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import '../index.css'
export const ProfilePage= () => {

    // const [exerciseArr, setExerciseArr] = useState<SavedExercise[]>([])
    // TODO: Create function to get exercises from db and display them on page
//     const getExercises = async () => {
//         try {
//             const response = await fetch('/api/exercises', 
//                 {
//                     method: 'GET'
//                 }
//             )
//             if (!response.ok) {
//                 throw new Error(`invalid API response, check network tab! Status: ${response.status}`);
//             }
//             const data = await response.json()
//             setExerciseArr(data);
//         } catch (error) {
//             console.error('Could not retrieve exercises!')
//         }
//     }

//     useEffect(() => {
//         getExercises()
//     }, [])
// import  React, { useState, useEffect } from 'react';
// export const ProfilePage: React.FC = () => {

    const { currentUser } = useUser();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
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
        return <div>{error}</div>;
    }
 
    return (
        <>
            <div className='centered'>
                <div>
                    <h1>{userData.username}</h1>
                </div>
                <section className='cardrow'>
                       
                </section>
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