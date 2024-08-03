import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Reemplaza useHistory con useNavigate
import './AuthStyles.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();  // Usa useNavigate en lugar de useHistory

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    console.log('Registering with:', { username, email, password });

    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })  // Verifica los datos enviados
      });
      const data = await response.json();
      if (response.status === 201) {
        console.log('Registration successful:', data);
        navigate('/');  // Navega a la página principal después del registro exitoso
      } else {
        alert('Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src={`${process.env.PUBLIC_URL}/clickalm.png`} alt="Clickalm" />
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Repeat Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">Registrarse</button>
          <button type="button" onClick={() => navigate('/')}>Ya tengo cuenta</button>  {/* Usa navigate en lugar de history.push */}
        </form>
      </div>
    </div>
  );
};

export default Register;
