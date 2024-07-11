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
      setKeyToPress(getRandomKey());
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
      alert(`Tu resultado es: ${score}. ¿Quieres jugar de nuevo?`);
      setGameStarted(false);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, score]);

  const getRandomKey = () => {
    const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return keys.charAt(Math.floor(Math.random() * keys.length));
  };

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
        <button onClick={() => setGameStarted(true)}>Iniciar Juego</button>
      </div>
    );
  }

  return (
    <div className="game-container" onClick={inputType === 'mouse' ? handleMouseClick : null}>
      <h1>Chao Es3</h1>
      <div className="instruction-container">
        <p className="instruction">
          APLASTA: <span className="input-type">{inputType === 'keyboard' ? `Tecla "${keyToPress}"` : 'Mouse'}</span>
        </p>
      </div>
      <div className={`display-screen ${highlight ? 'highlight' : ''}`}></div>
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
      {attempts === 0 && <button onClick={() => {
        alert(`Juego terminado! Tu puntaje total es ${score}.`);
        setGameStarted(false);
        setAttempts(3);
        setScore(0);
        setTimeLeft(15);
      }}>Guardar Puntaje</button>}
    </div>
  );
};

export default Game;
