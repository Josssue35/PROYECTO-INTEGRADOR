import React from 'react';
import ScoreDisplay from './ScoreDisplay';
import ParticlesComponent from './particles';
import NavBar from './NavBar';
import './GamePage.css';

const GamePage = () => {
  return (
    <div className="app">
      <NavBar /> {/* Agrega la barra de navegación aquí */}
      <ParticlesComponent />
      <div className="content">
        <h1 className="title">KeepCalm Games</h1>
        <div className="image-gallery">
          <div className="image-wrapper">
            <img src={`${process.env.PUBLIC_URL}/Pulpo.jpeg`} alt="Clickalm logo" className="image" />
          </div>
          <div className="image-wrapper">
            <img src={`${process.env.PUBLIC_URL}/Designer.jpeg`} alt="Popit logo" className="image" />
          </div>
        </div>
      </div>
      <ScoreDisplay game="Clickalm" />
      <ScoreDisplay game="Popit" />
      <div className="footer">@KeepCalm</div>
    </div>
  );
};

export default GamePage;
