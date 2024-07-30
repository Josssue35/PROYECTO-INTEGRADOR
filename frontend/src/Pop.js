import React, { useState } from 'react';
import './Pop.css';
import popSound from './Pop.mp3'; // Asegúrate de tener el archivo Pop.mp3 en la carpeta src

const Pop = () => {
    const [clickedCircles, setClickedCircles] = useState(Array(20).fill(false));

    const handleClick = index => {
        const newClickedCircles = [...clickedCircles];
        newClickedCircles[index] = !newClickedCircles[index];
        setClickedCircles(newClickedCircles);

        const sound = new Audio(popSound);
        sound.play();
    };

    return (
        <div className="container">
            <div className="PopIt">
                {[...Array(4)].map((_, rowIndex) => (
                    <div className="row" key={rowIndex}>
                        {[...Array(5)].map((_, circleIndex) => {
                            const index = rowIndex * 5 + circleIndex;
                            return (
                                <div
                                    key={index}
                                    className={`circle ${clickedCircles[index] ? 'clicked' : ''}`}
                                    onClick={() => handleClick(index)}
                                ></div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Pop;
