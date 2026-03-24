import React, { useEffect, useState } from 'react';
import {  UserService } from '../../infrastructure/UserService';
import { UserRole } from '../../domain/UserRole';
import type { User } from '../../../auth/domain/AuthRepository';

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newModEmail, setNewModEmail] = useState('');
  const [newModPassword, setNewModPassword] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.findAll();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddModerator = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await UserService.createModerator(newModEmail, newModPassword);
      setNewModEmail('');
      setNewModPassword('');
      setShowAddForm(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await UserService.updateRole(userId, newRole);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole as UserRole } : user
        )
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Team / Moderators</h3>
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Moderator'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddModerator} style={{ background: '#f9f9f9', padding: '10px', marginBottom: '10px' }}>
            <div style={{ marginBottom: '10px' }}>
                <label>Email: </label>
                <input type="email" value={newModEmail} onChange={e => setNewModEmail(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label>Password: </label>
                <input type="password" value={newModPassword} onChange={e => setNewModPassword(e.target.value)} required />
            </div>
            <button type="submit">Create Moderator</button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Email</th>
            <th style={{ padding: '8px' }}>Provider</th>
            <th style={{ padding: '8px' }}>Role</th>
            <th style={{ padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{user.email}</td>
              <td style={{ padding: '8px' }}>
                 <span style={{ 
                     padding: '2px 6px', 
                     borderRadius: '4px',
                     fontSize: '0.8rem',
                     backgroundColor: user.provider === 'local' ? '#e0e0e0' : '#d1c4e9',
                     color: user.provider === 'local' ? '#333' : '#512da8'
                 }}>
                     {user.provider}
                 </span>
              </td>
              <td style={{ padding: '8px' }}>{user.role}</td>
              <td style={{ padding: '8px' }}>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  style={{ padding: '4px' }}
                >
                  <option value={UserRole.EDITOR}>Editor</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};