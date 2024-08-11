import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AuthStyles.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const userData = await response.json();
      if (response.status === 200) {
        console.log('Login successful:', userData);
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userRole', userData.role);
        navigate('/main');
      } else {
        toast.error('Nombre de usuario o contraseña incorrectos.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'custom-toast-error',
          closeButton: false,
          style: { borderLeft: '5px solid red' },
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error en el inicio de sesión.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'custom-toast-error',
        closeButton: false,
        style: { borderLeft: '5px solid red' },
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src={`${process.env.PUBLIC_URL}/Designer1.png`} alt="Clickalm" />
      </div>
      <div className="form-container">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Inicia sesión</button>
          <button type="button" onClick={() => navigate('/register')}>Regístrate</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
