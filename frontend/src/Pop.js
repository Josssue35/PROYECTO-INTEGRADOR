import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Pop.css';
import Navbar from './NavBar';

const Pop = () => {
    const [bubbles, setBubbles] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [bubblesPressed, setBubblesPressed] = useState(0);
    const [scoreSaved, setScoreSaved] = useState(false); // Nuevo estado para rastrear si el puntaje fue guardado

    const userId = localStorage.getItem('userId'); // Obtener el userId del local storage

    // Crear una nueva burbuja
    const createBubble = () => {
        const bubbleWidth = 180;
        const screenWidth = window.innerWidth;
        const maxX = screenWidth - bubbleWidth;

        const bubbleClass = `bubble-${Math.ceil(Math.random() * 5)}`;

        const bubble = {
            id: Date.now(),
            x: Math.random() * maxX,
            y: -180,
            className: bubbleClass
        };
        setBubbles((prevBubbles) => [...prevBubbles, bubble]);
    };

    useEffect(() => {
        if (!gameOver && !gameWon) {
            const bubbleInterval = setInterval(createBubble, 300);
            const moveInterval = setInterval(() => {
                setBubbles((prevBubbles) =>
                    prevBubbles.map((bubble) => ({ ...bubble, y: bubble.y + 80 }))
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
                if (bottom < 0 || left < 0 || (left + width) > window.innerWidth) {
                    setGameOver(true);
                    setBubbles([]);
                }
            }
        });
    }, [bubbles]);

    const playSound = () => {
        const sound = new Audio('/pop-sound.mp3');
        sound.play();
    };

    const handleBubbleClick = (id) => {
        playSound();
        setBubbles((prevBubbles) => prevBubbles.filter((bubble) => bubble.id !== id));
        setScore((prevScore) => {
            const newScore = prevScore + 1;
            if (newScore >= 75) {
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
        setScoreSaved(false); // Resetear el estado de guardado de puntaje
    };

    const saveScore = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/scorespop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    points: score,
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Score saved:', data);
            setScoreSaved(true); // Marcar el puntaje como guardado

            toast.success('¡Puntaje Guardado!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast2', // Clase personalizada para el toast
                closeButton: false,
            });
        } catch (error) {
            console.error('Error saving score:', error);
        }
    };

    return (
        <div className="game-container">
            <Navbar />
            <h1>PopIt</h1>
            <p>Puntaje: {score}</p>
            {gameOver && (
                <div className="message-container">
                    <p className="message">Se escapó una burbuja!</p>
                    <p className="message">Burbujas explotadas: {bubblesPressed}</p>
                    <button className="start-btn" onClick={resetGame}>Reiniciar</button>
                    {!scoreSaved && <button className="start-btn" onClick={saveScore}>Guardar Puntaje</button>}
                </div>
            )}
            {gameWon && (
                <div className="message-container">
                    <p className="message">¡Ganaste!</p>
                    <p className="message">Burbujas explotadas: {bubblesPressed}</p>
                    <button className="start-btn" onClick={resetGame}>Reiniciar</button>
                    {!scoreSaved && <button className="start-btn" onClick={saveScore}>Guardar Puntaje</button>}
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
            <ToastContainer />
        </div>
    );
};

export default Pop;
