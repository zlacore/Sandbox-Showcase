import  {createContext, useState, useContext, useEffect} from "react";
import Auth from '../utils/auth';

// Define el tipo para el contexto
// class UserContextType {
//     currentUser: { username: string } | null;
//   setCurrentUser: (user: { username: string } | null) => void;
// }

// Creamos el contexto con valores iniciales
const UserContext = createContext(undefined);

// Creamos un provider para envolver nuestra app
export const UserProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);
  // const [userData, setUserData] = useState(null)
  // Check for existing token on app load
  useEffect(() => {
    const checkExistingToken = () => {
      if (Auth.loggedIn()) {
        const profile = Auth.getProfile();
        console.log('Token profile data:', profile);
        if (profile && profile.username) {
          const userData = {
            id: profile.id,
            username: profile.username,
            email: profile.email
          };
          setCurrentUser(userData);
          console.log('Setting user from token:', userData);
        } else {
          console.log('Token exists but missing user data, profile:', profile);
          // Don't clear token here, just log the issue
        }
      } else {
        console.log('No valid token found');
      }
    };

    checkExistingToken();
  }, []);

  // Log currentUser changes
  useEffect(() => {
    console.log('Current user changed:', currentUser);
  }, [currentUser]);

  

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acceder fácilmente al contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};

