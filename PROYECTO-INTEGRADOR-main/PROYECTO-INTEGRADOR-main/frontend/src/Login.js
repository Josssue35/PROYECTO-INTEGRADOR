import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './AuthStyles.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const userData = await response.json();
      if (response.status === 200) {
        console.log('Login successful:', userData);
        history.push('/game');  // Navegar a la página del juego después del login exitoso
      } else {
        alert('Username or password incorrect.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed.');
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src={`${process.env.PUBLIC_URL}/clickalm.png`} alt="Clickalm" />
      </div>
      <div className="form-container">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Inicia sesión</button>
          <button type="button" onClick={() => history.push('/register')}>Registrate</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
