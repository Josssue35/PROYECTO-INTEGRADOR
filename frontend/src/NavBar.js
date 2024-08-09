// NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Asegúrate de ajustar la ruta si es diferente

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/main">
                    <img src={`${process.env.PUBLIC_URL}/icon.png`} alt="Logo" className="logo" />
                </Link>
            </div>
            <div className="navbar-links">
                <Link to="/game" className="nav-link">Clickalm</Link>
                <Link to="/pop" className="nav-link">Popit</Link>
                <Link to="/scores" className="nav-link">Ranking</Link>

            </div>
        </nav>
    );
};

export default NavBar;
