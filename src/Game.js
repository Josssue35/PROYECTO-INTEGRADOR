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
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);

  const getRandomKey = () => {
    const keys = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return keys.charAt(Math.floor(Math.random() * keys.length));
  };

  const initializeGame = useCallback(() => {
    const newInputType = Math.random() < 0.5 ? 'keyboard' : 'mouse';
    setInputType(newInputType);
    setClicks(0);
    setTarget(Math.floor(Math.random() * 20) + 20);
    setAttempts(3);
    if (newInputType === 'keyboard') {
      setKeyToPress(getRandomKey());
    }
  }, []);

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
      setTimeLeft(15);
      setScore(0);
      setClicks(0);
      setAttempts(3);
      setTimeout(() => setGameStarted(true), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (inputType === 'keyboard' && e.key === keyToPress && gameStarted) {
        setHighlight(true);
        setTimeout(() => setHighlight(false), 200);
        setClicks(prevClicks => prevClicks + 1);
        if (clicks + 1 === target) {
          setScore(prevScore => prevScore + 1);
          initializeGame();
        }
      }
    };

    if (gameStarted && inputType === 'keyboard') {
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      if (inputType === 'keyboard') {
        window.removeEventListener('keydown', handleKeyPress);
      }
    };
  }, [clicks, inputType, keyToPress, target, initializeGame, gameStarted]);

  const handleMouseClick = useCallback(() => {
    if (inputType === 'mouse' && gameStarted) {
      setHighlight(true);
      setTimeout(() => setHighlight(false), 200);
      setClicks(prevClicks => prevClicks + 1);
      if (clicks + 1 === target) {
        setScore(prevScore => prevScore + 1);
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
      {attempts === 0 && (
        <button onClick={() => {
          alert(`¡Juego terminado! Tu puntaje total es ${score}.`);
          setGameStarted(false);
          setAttempts(3);
          setScore(0);
          setTimeLeft(30);
        }}>Guardar Puntaje</button>
      )}
    </div>
  );
};

export default Game;
