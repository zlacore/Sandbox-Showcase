import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import App from './App.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Feed from './pages/Feed.jsx';
import Login from './pages/Login.jsx';
import { ProfilePage } from './pages/Profile.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { UploadPage } from './pages/Upload.jsx';
import { SignUp } from './pages/SignUp.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Feed />
      },
      {
        path: '/feed',
        element: <Feed />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/profile',
        element: <ProfilePage />
      },
      {
        path: '/upload',
        element: <UploadPage />
      },
      {
        path: '/signup',
        element: <SignUp />
      }
    ]
  }
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <UserProvider>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </UserProvider>
  );
}
