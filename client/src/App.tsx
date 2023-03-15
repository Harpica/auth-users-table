import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { DEFAULT_USER } from './utils/constants';
import { UserData } from './utils/types';
import AuthView from './views/AuthView';
import MainView from './views/MainView';

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserData>(DEFAULT_USER);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/sign-in'
          element={
            <AuthView
              type='Login'
              setIsAuth={setIsAuth}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          path='/sign-up'
          element={
            <AuthView
              type='Register'
              setIsAuth={setIsAuth}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          path='/'
          element={
            <ProtectedRoute authKey={isAuth}>
              <MainView setIsAuth={setIsAuth} currentUser={currentUser} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
