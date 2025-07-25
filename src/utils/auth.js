// Importing the jwtDecode function from jwt-decode library
import { jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile() {
    try {
      // Decode the JSON Web Token (JWT) using the jwtDecode function
      const token = this.getToken();
      if (!token) return null;
      return jwtDecode(token);
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      // Attempt to decode the provided token using jwtDecode
      const decoded = jwtDecode(token);

      // Check if the decoded token has an 'exp' (expiration) property and if it is less than the current time in seconds.
      if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
        // If the token is expired, return true indicating that it is expired.
        return true;
      }
      return false;
    } catch (err) {
      // If decoding fails (e.g., due to an invalid token format), catch the error and return true (expired).
      console.error('Token decoding failed:', err);
      return true;
    }
  }

  getToken() {
    const loggedUser = localStorage.getItem('id_token') || '';
    console.log('Retrieved token from localStorage:', loggedUser);
    return loggedUser;
  }

  login(idToken) {
    console.log('Storing token in localStorage:', idToken);
    localStorage.setItem('id_token', idToken);
    // Don't redirect here - let the component handle it
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
