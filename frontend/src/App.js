import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './Game';
import Login from './Login';
import Register from './Register';
import Scores from './Scores';
import GamePage from './GamePage';
import Pop from './Pop';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/game" element={<Game />} />
          <Route path="/register" element={<Register />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/main" element={<GamePage />} />
          <Route path="/pop" element={<Pop />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
