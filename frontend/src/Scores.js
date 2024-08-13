import React, { useEffect, useState } from 'react';
import './Scores.css';
import ParticlesComponent from './particles';
import Navbar from './NavBar';

const Scores = () => {
  const [scoreskalm, setScores] = useState([]);
  const [additionalScores, setAdditionalScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/scoreskalm');
        const data = await response.json();
        setScores(data);
      } catch (error) {
        console.error('Failed to fetch scores:', error);
      }
    };

    const fetchScoresPop = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/scorespop');
        const data = await response.json();
        setAdditionalScores(data);
      } catch (error) {
        console.error('Failed to fetch additional scores:', error);
      }
    };

    fetchScores();
    fetchScoresPop();
  }, []);

  return (
    <div className="scores-page">
      <ParticlesComponent />
      <Navbar />
      <div className="ranking-container">
        <div className="ranking-section">
          <div className="image-container">
            <img src={`${process.env.PUBLIC_URL}/PulpoS.png`} alt="Clickalm Logo" className="scores-logo" />
          </div>
          <div className="scores-list">
            <h1>Ranking ClicKalm</h1>
            <ul>
              {scoreskalm.map((score, index) => (
                <li key={index} className="score-item">
                  <span className="username">{score.username}</span>
                  <span className="points">{score.points}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ranking-section">
          <div className="image-container">
            <img src={`${process.env.PUBLIC_URL}/PopS.png`} alt="Clickalm Logo" className="scores-logo" />
          </div>
          <div className="scores-list">
            <h1>Ranking Popit</h1>
            <ul>
              {additionalScores.map((score, index) => (
                <li key={index} className="score-item">
                  <span className="username">{score.username}</span>
                  <span className="points">{score.points}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scores;
