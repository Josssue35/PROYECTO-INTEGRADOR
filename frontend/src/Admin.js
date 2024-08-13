import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Admin.css'; // Importa el CSS personalizado

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ username: '', password: '', email: '', role: '' });
    const [editMode, setEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin');
            if (!response.ok) throw new Error('Error fetching users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error al obtener los usuarios.', {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const options = {
                method: editMode ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            };

            const response = await fetch(
                editMode ? `/api/admin/${currentUser.id}` : '/api/admin',
                options
            );

            if (!response.ok) throw new Error('Error saving user');

            fetchUsers();
            setForm({ username: '', password: '', email: '', role: '' });
            setEditMode(false);

            // Mostrar notificación de éxito
            toast.success(editMode ? 'Usuario actualizado exitosamente.' : 'Usuario creado exitosamente.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast-success',
                closeButton: false,
                style: { borderLeft: '5px solid green' },
            });
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error('Error al guardar el usuario.', {
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

    const handleEdit = (user) => {
        setForm({ username: user.username, password: '', email: user.email, role: user.role });
        setCurrentUser(user);
        setEditMode(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                const response = await fetch(`/api/admin/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Error deleting user');

                // Mostrar notificación de éxito
                toast.success('Usuario eliminado exitosamente.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    className: 'custom-toast-success',
                    closeButton: false,
                    style: { borderLeft: '5px solid green' },
                });

                fetchUsers();
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
                    className: 'custom-toast-error',
                    closeButton: false,
                    style: { borderLeft: '5px solid red' },
                });
            }
        }
    };

    return (
        <div className="admin-container">
            <h1>Admin Panel</h1>
            <form onSubmit={handleSubmit} className="admin-form">
                <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required={!editMode}
                />
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <select name="role" value={form.role} onChange={handleChange}>
                    <option value="admin">admin</option>
                    <option value="user">user</option>
                </select>
                <button type="submit">{editMode ? 'Actualizar Usuario' : 'Crear Usuario'}</button>
            </form>
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleEdit(user)}>Editar</button>
                                    <button onClick={() => handleDelete(user.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Admin;
