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
  const [gameEnded, setGameEnded] = useState(false);

  // ID del usuario (puedes cambiar esto según cómo obtienes el ID del usuario en tu aplicación)
  const userId = 11; // Cambia esto al ID real del usuario

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
    setTimeLeft(15);
  }, []);

  const startNewGame = useCallback(() => {
    setScore(0);
    setGameEnded(false);
    setGameStarted(true);
    initializeGame();
  }, [initializeGame]);

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
      setGameEnded(true);
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
  const saveScore = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId, // Usa el ID del usuario del contexto
          points: score,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Score saved:', data);
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  if (!gameStarted && !gameEnded) {
    return (
      <div className="game-container">
        <img src={`${process.env.PUBLIC_URL}/clickalm.png`} alt="Clickalm" style={{ width: '800px' }} />
        <button onClick={startNewGame}>Iniciar Juego</button>
      </div>
    );
  }

  if (gameEnded) {
    return (
      <div className="game-container">
        <h1>¡Juego terminado!</h1>
        <p>Tu puntaje total es {score}.</p>
        <button onClick={startNewGame}>Iniciar Nueva Partida</button>
        <button onClick={saveScore}>Guardar Puntaje</button>
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
        <div className="stat">
          <p>Clics Restantes: <span>{target - clicks}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Game;
