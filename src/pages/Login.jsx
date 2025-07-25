import { useState} from 'react';
import '../assets/index.css'
import Auth from '../utils/auth';
import { login } from '../api/authApi';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Login = () => {
  const { setCurrentUser } = useUser();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (
    e
  ) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });

    console.log('loginData at handleChange', loginData.username, loginData.password)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('login data', loginData)
    try {
      const data = await login(loginData);
      console.log('Login response data:', data);
      console.log('Token received:', data.token);
      
      // Store token
      Auth.login(data.token);
      
      // Set the current user in context from the response
      if (data.user) {
        setCurrentUser(data.user);
        console.log('Current user set:', data.user);
      }
      
      // Navigate to home page
      navigate('/');
    } catch (err) {
      console.error('Failed to login', err);
    }
  };

  return (
    <div className='form-container'>
      <form className='form login-form' onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className='form-group'>
          <label>Username</label>
          <input
            className='form-input'
            type='text'
            name='username'
            value={loginData.username || ''}
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input
            className='form-input'
            type='password'
            name='password'
            value={loginData.password || ''}
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <button className='btn btn-primary' type='submit'>
            Login
          </button>
        </div>
      </form>
      <div>
        <p>
          No account yet?
          <Link to='/signup'>Sign Up!</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
