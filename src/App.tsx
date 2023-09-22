import './App.css';
import LoginForm from './pages/login/form';
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
      </div>
    </div>
  );
}

export default App;
