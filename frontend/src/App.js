import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './Game';
import Login from './Login';
import Register from './Register';
import Scores from './Scores';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/game" element={<Game />} />
          <Route path="/register" element={<Register />} />
          <Route path="/scores" element={<Scores />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
