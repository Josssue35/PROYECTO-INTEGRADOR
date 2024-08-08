import React, { useState, useEffect } from 'react';
import './Pop.css';

const Pop = () => {
    const [bubbles, setBubbles] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [bubblesPressed, setBubblesPressed] = useState(0);

    // Crear una nueva burbuja
    const createBubble = () => {
        const bubbleWidth = 180; // Ancho de la burbuja (más grande para mayor dificultad)
        const screenWidth = window.innerWidth;
        const maxX = screenWidth - bubbleWidth;

        // Asigna una clase aleatoria entre las burbujas disponibles
        const bubbleClass = `bubble-${Math.ceil(Math.random() * 5)}`;

        const bubble = {
            id: Date.now(),
            x: Math.random() * maxX, // Genera una posición dentro del ancho de la pantalla
            y: -180, // Ajustar el inicio para el nuevo tamaño
            className: bubbleClass
        };
        setBubbles((prevBubbles) => [...prevBubbles, bubble]);
    };

    useEffect(() => {
        if (!gameOver && !gameWon) {
            const bubbleInterval = setInterval(createBubble, 400); // Intervalo reducido para mayor dificultad
            const moveInterval = setInterval(() => {
                setBubbles((prevBubbles) =>
                    prevBubbles.map((bubble) => ({ ...bubble, y: bubble.y + 30 })) // Aumentar la velocidad
                );
            }, 50);

            return () => {
                clearInterval(bubbleInterval);
                clearInterval(moveInterval);
            };
        }
    }, [gameOver, gameWon]);

    useEffect(() => {
        bubbles.forEach((bubble) => {
            const bubbleElement = document.getElementById(`bubble-${bubble.id}`);
            if (bubbleElement) {
                const { bottom, left, width } = bubbleElement.getBoundingClientRect();
                if (bottom < 0 || left < 0 || (left + width) > window.innerWidth) { // La burbuja se ha escapado de la pantalla
                    setGameOver(true);
                    setBubbles([]);
                }
            }
        });
    }, [bubbles]);

    // Reproducir sonido al hacer clic en una burbuja
    const playSound = () => {
        const sound = new Audio('/pop-sound.mp3');
        sound.play();
    };

    const handleBubbleClick = (id) => {
        playSound();
        setBubbles((prevBubbles) => prevBubbles.filter((bubble) => bubble.id !== id));
        setScore((prevScore) => {
            const newScore = prevScore + 1;
            if (newScore >= 75) { // Aumentar el objetivo para ganar
                setGameWon(true);
            }
            return newScore;
        });
        setBubblesPressed((prevCount) => prevCount + 1);
    };

    const resetGame = () => {
        setBubbles([]);
        setScore(0);
        setGameOver(false);
        setGameWon(false);
        setBubblesPressed(0);
    };

    return (
        <div className="game-container">
            <h1>PopIt</h1>
            <p>Puntaje: {score}</p>
            {gameOver && (
                <div className="message-container">
                    <p className="message">Se escapo una burbuja!</p>
                    <p className="message">Burbujas explotadas: {bubblesPressed}</p>
                    <button className="start-btn" onClick={resetGame}>Reiniciar</button>
                </div>
            )}
            {gameWon && (
                <div className="message-container">
                    <p className="message">Ganaste!</p>
                    <p className="message">Burbujas explotadas: {bubblesPressed}</p>
                    <button className="start-btn" onClick={resetGame}>Reiniciar</button>
                </div>
            )}
            <div className="bubble-container">
                {bubbles.map((bubble) => (
                    <div
                        key={bubble.id}
                        id={`bubble-${bubble.id}`}
                        className={`bubble ${bubble.className}`}
                        style={{ left: `${bubble.x}px`, bottom: `${bubble.y}px` }}
                        onClick={() => handleBubbleClick(bubble.id)}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Pop;
