import React, { useState } from 'react'
// import styles from './LoginModal.module.css';

export const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const { token } = data;

            if (token) {
                localStorage.setItem('token', token);
            }

        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
            setError('There was a problem with your fetch operation');
        }
        console.log(formData);
    }


    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>

                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" id="username" placeholder="Enter your username here" onChange={handleChange} required />

                    <label htmlFor="email">Email Address:</label>
                    <input type="email" name="email" id="email" placeholder="Enter your email here" onChange={handleChange} required />

                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" placeholder="Enter your password here" onChange={handleChange} required />

                    <label htmlFor="confirm-pass">Confirm Password:</label>
                    <input type="password" name="confirm-pass" id="confirmPassword" placeholder="Confirm your password here" onChange={handleChange} required />
                    <div>
                        <button type="submit">Submit</button>
                    </div>

                </form>


            </div>
        </div>
    )
}