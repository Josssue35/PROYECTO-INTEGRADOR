import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Admin.css'; // Asegúrate de importar tu archivo CSS
import Navbar from './NavBar'; // Importa el componente Navbar

const Admin = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        email: '',
        role: '',
        fullName: '',
        countryId: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        // Cargar la lista de usuarios y países
        const fetchData = async () => {
            try {
                const usersResponse = await fetch('/api/admin');
                const usersData = await usersResponse.json();
                setUsers(usersData);

                const countriesResponse = await fetch('/api/countries');
                const countriesData = await countriesResponse.json();
                setCountries(countriesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const options = {
                method: editMode ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, countryId: form.countryId, fullname: form.fullName }),
            };

            const response = await fetch(editMode ? `/api/admin/${currentUser.id}` : '/api/admin', options);
            if (!response.ok) throw new Error('Error submitting form');
            const data = await response.json();

            if (editMode) {
                setUsers(users.map(user => (user.id === currentUser.id ? data : user)));
            } else {
                setUsers(prevUsers => [...prevUsers, data]);
            }

            setForm({ username: '', password: '', email: '', role: '', fullName: '', countryId: '' });
            setEditMode(false);
            toast.success('Usuario guardado exitosamente.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast1',
                closeButton: false
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Error al guardar el usuario.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast1',
                closeButton: false
            });
        }
    };

    const handleEdit = (user) => {
        setForm({
            username: user.username,
            password: '', // No se muestra la contraseña al editar
            email: user.email,
            role: user.role,
            fullName: user.full_name,
            countryId: user.country_id,
        });
        setEditMode(true);
        setCurrentUser(user);
    };

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`/api/admin/${userId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error deleting user');
            setUsers(users.filter(user => user.id !== userId));
            toast.success('Usuario eliminado exitosamente.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast1',
                closeButton: false
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Error al eliminar el usuario.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast1',
                closeButton: false
            });
        }
    };

    return (
        <div className="admin-page">
            <Navbar /> {/* Agrega el componente Navbar aquí */}
            <div className="admin-content">
                <div className="admin-container">
                    <h1>Administración de Usuarios</h1>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <input name="username" placeholder="Nombre de usuario" value={form.username} onChange={handleChange} required />
                        <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
                        <input name="password" placeholder="Contraseña" type="password" value={form.password} onChange={handleChange} />
                        <input name="fullName" placeholder="Nombre Completo" value={form.fullName} onChange={handleChange} required />
                        <select name="countryId" value={form.countryId} onChange={handleChange} required>
                            <option value="">Seleccione un país</option>
                            {countries.map((country) => (
                                <option key={country.id} value={country.id}>{country.name}</option>
                            ))}
                        </select>
                        <select name="role" value={form.role} onChange={handleChange} required>
                            <option value="">Seleccione un rol</option>
                            <option value="user">Usuario</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button type="submit">{editMode ? 'Actualizar Usuario' : 'Crear Usuario'}</button>
                    </form>

                    <div className="admin-table-container">
                        <h2>Lista de Usuarios</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Nombre de usuario</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Nombre Completo</th>
                                    <th>País</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.full_name}</td>
                                        <td>{countries.find(country => country.id === user.country_id)?.name || 'Desconocido'}</td>
                                        <td>
                                            <button className="edit-button" onClick={() => handleEdit(user)}>Editar</button>
                                            <button className="delete-button" onClick={() => handleDelete(user.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ToastContainer className="custom-toast-container" />
        </div>
    );
};

export default Admin;
