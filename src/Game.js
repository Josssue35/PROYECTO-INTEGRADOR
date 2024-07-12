import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './Game.css';

const Game = () => {
  const [score, setScore] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentKey, setCurrentKey] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('black');
  const [color, setColor] = useState('white');
  const [highlight, setHighlight] = useState(false);

  const props = useSpring({
    backgroundColor: backgroundColor,
    from: { backgroundColor: 'black' },
    reset: true
  });

  const keys = ['Space', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'a', '', 'd', 'w'];
  const keyLimits = {
    'a': 15,
    '': 20,
    'd': 10,
    'w': 12,
    'Space': 10,
    'Enter': 15,
    'ArrowUp': 12,
    'ArrowDown': 10,
    'ArrowLeft': 15,
    'ArrowRight': 12,
    'Click del Ratón': 20
  };

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
        if (clicks >= keyLimits[currentKey]) {
          const randomIndex = Math.floor(Math.random() * (keys.length + 1)); // +1 para incluir el click de ratón
          setCurrentKey(randomIndex < keys.length ? keys[randomIndex] : 'Click del Ratón');
          setBackgroundColor(getRandomColor());
          setColor(getRandomColor());
          setClicks(0);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft, clicks, currentKey]);

  useEffect(() => {
    if (isPlaying) {
      setHighlight(true);
      setTimeout(() => {
        setHighlight(false);
      }, 500); // Duración del efecto de iluminación
    }
  }, [isPlaying, currentKey]);

  const handleKeyDown = (event) => {
    if (isPlaying && (event.key === currentKey)) {
      setClicks(clicks + 1);
      setScore(score + 10);
      setBackgroundColor(getRandomColor());
      setColor(getRandomColor());
    }
  };

  const handleMouseClick = () => {
    if (isPlaying && currentKey === 'Click del Ratón') {
      setClicks(clicks + 1);
      setScore(score + 10);
      setBackgroundColor(getRandomColor());
      setColor(getRandomColor());
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setClicks(0);
    setTimeLeft(15);
    setCurrentKey(keys[Math.floor(Math.random() * keys.length)]);
    setBackgroundColor('black');
    setColor('white');
  };

  const endGame = () => {
    setIsPlaying(false);
    alert(Juego terminado! Tu puntaje total es ${score}.);
  };

  const getRandomColor = () => {
    const colors = ['#FF69B4', '#33CC33', '#66CCCC', '#FFCC00', '#0099CC', '#FF99FF', '#66FF66', '#CCFFCC', '#FFFF66'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <animated.div
      className="game-container"
      style={{
        ...props,
        color,
        padding: '20px',
        borderRadius: '10px',
        border: highlight ? '2px solid #FFFF00' : 'none'
      }}
      tabIndex="0"
      onKeyDown={handleKeyDown}
      onClick={handleMouseClick}
    >
      {!isPlaying ? (
        <button onClick={startGame} style={{ fontSize: '24px', padding: '10px', marginTop: '20px', backgroundColor: '#282c34', color: 'white', border: 'none', borderRadius: '5px' }}>
          Inicia el juego
        </button>
      ) : (
        <>
          <div
            className="key-container"
            style={{
              backgroundColor: highlight ? '#FFFF00' : 'transparent',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #CCCCCC'          }}
              >
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{currentKey}</p>
                <p>Aplasta {keyLimits[currentKey]} veces</p>
              </div>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Tiempo restante: {timeLeft} segundos</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Puntaje: {score}</p>
            </>
          )}
        </animated.div>
      );
    };
    
    export default Game;