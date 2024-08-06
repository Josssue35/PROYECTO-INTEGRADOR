import React from 'react';
import { Link } from 'react-router-dom';
import './GamePage.css';
import ParticlesComponent from './particles';

const GamePage = () => {
    return (
        <div className="app">
            <ParticlesComponent />
            <div className="content">
                <h1 className="title">Game Page</h1>
                <div className="image-gallery">
                    <div className="image-wrapper">
                        <Link to="/game">
                            <img src={`${process.env.PUBLIC_URL}/Pulpo.jpeg`} alt="Clickalm logo" className="image" />
                        </Link>
                    </div>
                    <div className="image-wrapper">
                        <Link to="/pop">
                            <img src={`${process.env.PUBLIC_URL}/Designer.jpeg`} alt="Clickalm logo" className="image" />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="footer">@Clickalm</div>
        </div>
    );
};

export default GamePage;
