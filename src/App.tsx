import './App.css';
import React from 'react';
import { ChatRoom, LoginForm } from './pages';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ChatRoomContextProvider, ChatRoomData, UserData, UserDataContextProvider } from './types/context';

export const UserDataContext = React.createContext<UserDataContextProvider | null>(null);
export const ChatRoomContext = React.createContext<ChatRoomContextProvider | null>(null);

function App() {
  const [ userData, setUserData ] = React.useState<UserData>({ username: '' });
  const [ chatRoomData, setChatRoomData ] = React.useState<ChatRoomData>({ userList: [] });

  return (
    <div className="App">
      <div className="App-header">
        <UserDataContext.Provider value={{ userData, setUserData }} >
          <ChatRoomContext.Provider value={{ chatRoomData, setChatRoomData }}>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<LoginForm />} />
                <Route path='/chat-room' element={<ChatRoom />} />
                <Route path='*' element={<LoginForm />} />
              </Routes>
            </BrowserRouter>
          </ChatRoomContext.Provider>
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
