import React, { useEffect, useState } from 'react';
import './AuthStyles.css';

const Scores = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/scores');
        const data = await response.json();
        setScores(data);
      } catch (error) {
        console.error('Failed to fetch scores:', error);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="scores-container">
      <img src={`${process.env.PUBLIC_URL}/clickalm.png`} alt="Clickalm Logo" className="scores-logo" />
      <h1>Puntuación</h1>
      <ul>
        {scores.map((score, index) => (
          <li key={index} className="score-item">
            <span className="username">{score.username}</span>
            <span className="points">{score.points}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scores;
