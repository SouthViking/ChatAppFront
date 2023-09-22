import './App.css';
import React from 'react';
import LoginForm from './pages/login/form';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserData, UserDataContextProvider } from './types/context';

export const UserDataContext = React.createContext<UserDataContextProvider | null>(null);

function App() {
  const [userData, setUserData] = React.useState<UserData>({ username: '' });

  return (
    <div className="App">
      <div className="App-header">
      <UserDataContext.Provider value={{ userData, setUserData }} >
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<LoginForm />} />
              <Route path='*' element={<LoginForm />} />
            </Routes>
          </BrowserRouter>
        </UserDataContext.Provider>

        <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />

      </div>
    </div>
  );
}

export default App;
