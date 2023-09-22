import './App.css';
import LoginForm from './pages/login/form';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LoginForm />} />
            <Route path='*' element={<LoginForm />} />
          </Routes>
        </BrowserRouter>

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
