
import React, { useEffect, useState } from 'react';

const ScoreDisplay = ({ game }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/scores/${game}`);
        const data = await response.json();
        setScores(data);
      } catch (error) {
        console.error('Failed to fetch scores:', error);
      }
    };

    fetchScores();
  }, [game]);

  return (
    <div>
      <h2>Ranking {game}</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>
            {score.username}: {score.points}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreDisplay;
