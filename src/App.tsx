// import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Logout from './pages/Logout';

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        {/* <Route component={NotFound} /> */}
      </Routes>
    </Router>
  )
}

const container = document.getElementById('root');
let root;

// Verifica se a raiz já foi criada
if (!container._reactRootContainer) {
  root = ReactDOM.createRoot(container);
} else {
  root = container._reactRootContainer;
}

// Renderiza o aplicativo
root.render(<App />);