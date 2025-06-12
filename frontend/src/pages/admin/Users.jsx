import { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import './Users.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', email: '', firstName: '', lastName: '', phone: '', _id: null });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await axios.get('/users');
    setUsers(data);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (isEdit) {
      await axios.put(`/users/${form._id}`, form);
    } else {
      await axios.post('/users', form);
    }
    setForm({ username: '', email: '', firstName: '', lastName: '', phone: '', _id: null });
    setIsEdit(false);
    fetchUsers();
  };

  const handleEdit = u => {
    setForm({ ...u, _id: u._id });
    setIsEdit(true);
  };

  const handleDelete = async id => {
    await axios.delete(`/users/${id}`);
    fetchUsers();
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Users</h1>

      <form className="user-form" onSubmit={handleSubmit}>
        <input name="username"  placeholder="Username" value={form.username}  onChange={handleChange} required />
        <input name="email"     placeholder="Email"    value={form.email}     onChange={handleChange} />
        <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} />
        <input name="lastName"  placeholder="Last name"  value={form.lastName}  onChange={handleChange} />
        <input name="phone"     placeholder="Phone"      value={form.phone}     onChange={handleChange} />
        <button type="submit" className="btn submit-btn">
          {isEdit ? 'Update' : 'Create'}
        </button>
        {isEdit && (
          <button
            type="button"
            className="btn cancel-btn"
            onClick={() => { setIsEdit(false); setForm({ username: '', email: '', firstName: '', lastName: '', phone: '', _id: null }); }}
          >Cancel</button>
        )}
      </form>

      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th><th>Email</th><th>Name</th><th>Phone</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.phone}</td>
              <td>
                <button className="btn edit-btn"  onClick={() => handleEdit(u)}>✏️</button>
                <button className="btn delete-btn" onClick={() => handleDelete(u._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
