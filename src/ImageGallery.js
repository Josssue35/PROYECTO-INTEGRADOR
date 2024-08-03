import React from 'react';
import './ImageGallery.css';
import ParticlesComponent from './particles';

const App = () => {
    return (
        <div className="app">
            <ParticlesComponent />
            <div className="content">
                <h1 className="title">Game Page</h1>
                <div className="image-gallery">
                    <div className="image-wrapper">
                        <img src={`${process.env.PUBLIC_URL}/clickalm.png`} alt="Image 1" className="image" />
                    </div>
                    <div className="image-wrapper">
                        <img src={`${process.env.PUBLIC_URL}/clickalm.png`} alt="Image 2" className="image" />
                    </div>
                </div>
            </div>
            <div className="footer">@Clickalm</div>
        </div>
    );
};

export default App;
