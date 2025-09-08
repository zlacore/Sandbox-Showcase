import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import styles from './LoginModal.module.css';

export const SignUp = () => {
    const navigate = useNavigate()
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
            // Only send required fields to backend
            const registrationData = {
                username: formData.username,
                email: formData.email,
                password: formData.password
            };
            
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData)
            });

            if (!response.ok) {
                // Check if response has content before trying to parse JSON
                const text = await response.text();
                console.error('Server error:', { status: response.status, text });
                
                let errorMessage = `Server error: ${response.status}`;
                try {
                    const errorData = JSON.parse(text);
                    errorMessage = errorData.message || errorMessage;
                } catch (parseError) {
                    errorMessage = text || errorMessage;
                }
                
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            const { token } = data;
            
            if (token) {
                localStorage.setItem('id_token', token);
            }

            navigate('/login')
        } catch (error) {
            window.alert(error)
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