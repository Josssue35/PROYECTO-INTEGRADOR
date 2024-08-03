import React, { useState } from 'react';
import './Pop.css';
import popSound from './Pop.mp3';

const Pop = () => {
    const [clickedCircles, setClickedCircles] = useState(Array(20).fill(false));

    const handleClick = index => {
        setClickedCircles(prev => {
            const newClickedCircles = [...prev];
            newClickedCircles[index] = !newClickedCircles[index];
            return newClickedCircles;
        });

        new Audio(popSound).play();
    };

    return (
        <div className="container">
            <div className="PopIt">
                {clickedCircles.map((clicked, index) => (
                    <div
                        key={index}
                        className={`circle ${clicked ? 'clicked' : ''}`}
                        onClick={() => handleClick(index)}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default Pop;
