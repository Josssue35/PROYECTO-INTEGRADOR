import React, { useState, useEffect, useCallback } from 'react';
import './Game.css';

const Game = () => {
  // Declaración de estados usando useState
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

  //Este useEffect se ejecuta cada vez que gameStarted cambia. Si el juego ha comenzado, llama a initializeGame.
  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [gameStarted, initializeGame]);

  //Este useEffect maneja el temporizador del juego. Cada segundo decrementa timeLeft si el juego está activo.
  //Cuando el tiempo llega a 0, el juego se detiene (sin reiniciar automáticamente).
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
  //Este useEffect añade un event listener para manejar las pulsaciones de teclas si el tipo de entrada es teclado y el juego ha comenzado.
  //Si se presiona la tecla correcta, incrementa los clics y, si se alcanza el objetivo, incrementa el puntaje y reinicia el juego.
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

  //Similar a handleKeyPress, esta función maneja los clics del ratón si el tipo de entrada es ratón y el juego ha comenzado.
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
  //Condicion de juego sin iniciar y finalizado
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
      {attempts === 0 && (
        <button onClick={() => {
          setGameStarted(false);
          setGameEnded(true);
        }}>Guardar Puntaje</button>
      )}
    </div>
  );
};

export default Game;
