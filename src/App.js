import React, { useState, useEffect, useCallback } from 'react';
import './Game.css';

const Game = () => {
  const [score, setScore] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [target, setTarget] = useState(Math.floor(Math.random() * 20) + 20);
  const [attempts, setAttempts] = useState(3);
  const [inputType, setInputType] = useState(Math.random() < 0.5 ? 'keyboard' : 'mouse');
  const [keyToPress, setKeyToPress] = useState('');
  const [highlight, setHighlight] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);

  const initializeGame = useCallback(() => {
    setInputType(Math.random() < 0.5 ? 'keyboard' : 'mouse');
    setClicks(0);
    setTarget(Math.floor(Math.random() * 20) + 20);
    setAttempts(3);
    if (inputType === 'keyboard') {
      const randomKey = getRandomKey();
      setKeyToPress(randomKey);
    }
  }, [inputType]);

  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [gameStarted, initializeGame]);

  useEffect(() => {
    let timer = null;
    if (timeLeft > 0 && gameStarted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameStarted) {
      setGameStarted(false);
      alert(`Tu resultado es: ${score}.`);
      const playAgain = window.confirm("¿Quieres jugar de nuevo?");
      if (playAgain) {
        setScore(0);
        setClicks(0);
        setAttempts(3);
        setTimeLeft(15);
        setGameStarted(true);
      }
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, score]);

  const getRandomKey = () => {
    const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return keys.charAt(Math.floor(Math.random() * keys.length));
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameStarted && inputType === 'keyboard' && e.key === keyToPress) {
        setHighlight(true);
        setTimeout(() => setHighlight(false), 200);
        setClicks((prevClicks) => prevClicks + 1);
        if (clicks + 1 === target) {
          setScore((prevScore) => prevScore + 1);
          initializeGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [clicks, inputType, keyToPress, target, initializeGame, gameStarted]);

  const handleMouseClick = useCallback(() => {
    if (inputType === 'mouse' && gameStarted) {
      setHighlight(true);
      setTimeout(() => setHighlight(false), 200);
      setClicks((prevClicks) => prevClicks + 1);
      if (clicks + 1 === target) {
        setScore((prevScore) => prevScore + 1);
        initializeGame();
      }
    }
  }, [clicks, inputType, target, initializeGame, gameStarted]);

  if (!gameStarted) {
    return (
      <div className="game-container">
        <img src={`${process.env.PUBLIC_URL}/clickalm.png`} alt="Clickalm" style={{ width: '800px' }} />
        <button onClick={() => setGameStarted(true)}>Iniciar Juego</button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1>Clickalm</h1>
      <div className="instruction-container">
        <p className="instruction">
          APLASTA: <span className="input-type">{inputType === 'keyboard' ? `Tecla "${keyToPress}"` : 'Mouse'}</span>
        </p>
      </div>
      <div
        className={`display-screen ${highlight ? 'highlight' : ''}`}
        onClick={handleMouseClick}
      >
      </div>
      <div className="stats">
        <div className="stat">
          <p>Tiempo Restante: <span>{timeLeft}</span></p>
        </div>
        <div className="stat">
          <p>Clics: <span>{clicks}</span></p>
        </div>
        <div className="stat">
          <p>Puntaje: <span>{score}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Game;