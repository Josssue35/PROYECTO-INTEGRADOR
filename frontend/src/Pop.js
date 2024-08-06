import React, { useState, useEffect, useRef } from 'react';
import './Pop.css'; // Asegúrate de crear este archivo CSS

const bubbles = ['one', 'two', 'three', 'four', 'five'];
const total = 50;

const Pop = () => {
    const [noPop, setNoPop] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isWinner, setIsWinner] = useState(false);
    const [bubblesList, setBubblesList] = useState([]);
    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);
    const shadowRef = useRef(null);
    const bubbleCreationInterval = useRef(null);

    useEffect(() => {
        if (gameOver) {
            if (bubbleCreationInterval.current) {
                clearInterval(bubbleCreationInterval.current);
            }
            setIsWinner(noPop >= total);
            shadowRef.current.style.display = 'flex';
        }
    }, [gameOver, noPop]);

    const createBubble = () => {
        const rand = Math.floor(Math.random() * bubbles.length);
        const left = Math.floor(Math.random() * (windowWidth.current - 150));
        const newBubble = {
            id: Date.now(),
            className: 'bubble bubble-' + bubbles[rand],
            style: { left: `${left}px`, top: `${windowHeight.current}px` }
        };
        setBubblesList((prevBubbles) => [...prevBubbles, newBubble]);
        animateBubble(newBubble.id);
    };

    const animateBubble = (id) => {
        let position = 0;
        const interval = setInterval(() => {
            if (position >= (windowHeight.current + 150)) {
                clearInterval(interval);
                setBubblesList((prevBubbles) => prevBubbles.filter(bubble => bubble.id !== id));
                setGameOver(true);
            } else {
                position++;
                setBubblesList((prevBubbles) =>
                    prevBubbles.map(bubble =>
                        bubble.id === id ? { ...bubble, style: { ...bubble.style, top: `${windowHeight.current - position}px` } } : bubble
                    )
                );
            }
        }, 12 - Math.floor(noPop / 10) + Math.floor(Math.random() * 6 - 3));
    };

    const deleteBubble = (id) => {
        setBubblesList((prevBubbles) => prevBubbles.filter(bubble => bubble.id !== id));
        setNoPop((prevNoPop) => prevNoPop + 1);
        if (noPop + 1 >= total) {
            setGameOver(true);
        }
    };

    const startGame = () => {
        // Ocultar la sección de inicio y mostrar el juego
        document.querySelector('.main-game').style.display = 'none';
        shadowRef.current.style.display = 'none';
        setBubblesList([]);
        setNoPop(0);
        setGameOver(false);
        bubbleCreationInterval.current = setInterval(() => {
            if (!gameOver && noPop < total) {
                createBubble();
            }
        }, 800 + Math.floor(Math.random() * 600 - 100));
    };

    const restartGame = () => {
        if (bubbleCreationInterval.current) {
            clearInterval(bubbleCreationInterval.current);
        }
        setBubblesList([]);
        setNoPop(0);
        setGameOver(false);
        shadowRef.current.style.display = 'none';
        document.querySelector('.main-game').style.display = 'flex'; // Volver a mostrar la sección de inicio
    };

    return (
        <div>
            <div className="score-board">
                <p>You Popped <span className="score">{noPop}</span> Bubbles</p>
            </div>
            <div className="shadow" ref={shadowRef}>
                {isWinner ? (
                    <div className="wrapper winner">
                        <h4>Congratulations</h4>
                        <h4>You Popped all 50 bubbles</h4>
                        <p>You are a Winner!</p>
                        <button onClick={restartGame} className="restart">Play Again</button>
                    </div>
                ) : (
                    <div className="wrapper loser">
                        <h4>Sorry</h4>
                        <h4>You Popped <span className="score">{noPop}</span> Bubbles</h4>
                        <p>Play Again?</p>
                        <button onClick={restartGame} className="restart">Play Again</button>
                        <button onClick={() => shadowRef.current.style.display = 'none'} className="cancel">Cancel</button>
                    </div>
                )}
            </div>
            <div className="main-game" style={{ display: gameOver ? 'none' : 'flex' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Ready to Start</h2>
                    <button onClick={startGame} className="start-btn">Start</button>
                </div>
            </div>
            {bubblesList.map((bubble) => (
                <div
                    key={bubble.id}
                    className={bubble.className}
                    style={bubble.style}
                    onClick={() => deleteBubble(bubble.id)}
                />
            ))}
        </div>
    );
};

export default Pop;
