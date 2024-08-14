import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AuthStyles.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Añadido para el nombre completo
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch countries from the API
    const fetchCountries = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/countries');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.warning('Las contraseñas no coinciden.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'custom-toast', // Clase personalizada
        closeButton: false,
        style: { borderLeft: '5px solid orange' }, // Color de la barra
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password,
          full_name: fullName,
          country_id: selectedCountry
        })
      });
      const data = await response.json();
      if (response.status === 201) {
        navigate('/');
      } else {
        toast.error('Registro incorrecto.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'custom-toast-error', // Clase personalizada para error
          closeButton: false,
          style: { borderLeft: '5px solid red' }, // Color de la barra para error
        });
      }
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };


  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src={`${process.env.PUBLIC_URL}/Designer1.png`} alt="Clickalm" />
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
          <input
            type="text"
            placeholder="Full Name" // Campo añadido para nombre completo
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          <button type="submit">Registrarse</button>
          <button type="button" onClick={() => navigate('/')}>Ya tengo cuenta</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
