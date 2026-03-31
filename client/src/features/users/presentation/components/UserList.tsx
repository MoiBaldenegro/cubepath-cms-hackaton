import React, { useEffect, useState } from 'react';
import { UserService } from '../../infrastructure/UserService';
import { UserRole } from '../../domain/UserRole';
import type { User } from '../../../auth/domain/AuthRepository';
import styles from './UserList.module.css';

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar usuarios';
      setError(message);
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear moderador';
      alert(message);
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar el rol';
      alert(message);
    }
  };

  const roleLabels: Record<string, string> = {
    ADMIN: 'Administrador',
    EDITOR: 'Editor',
    USER: 'Usuario',
  };

  if (loading) return <div className={styles.loading}>Cargando usuarios...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Equipo y Moderadores</h3>
        <button
          className={styles.addButton}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <span className={styles.addButtonIcon}>+</span>
          {showAddForm ? 'Cancelar' : 'Agregar Moderador'}
        </button>
      </div>

      {showAddForm && (
        <form className={styles.addForm} onSubmit={handleAddModerator}>
          <div className={styles.addFormTitle}>Agregar Nuevo Moderador</div>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Correo electrónico</label>
              <input
                type="email"
                className={styles.input}
                value={newModEmail}
                onChange={(e) => setNewModEmail(e.target.value)}
                placeholder="moderador@empresa.com"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Contraseña</label>
              <input
                type="password"
                className={styles.input}
                value={newModPassword}
                onChange={(e) => setNewModPassword(e.target.value)}
                placeholder="Contraseña segura"
                required
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn}>Crear Moderador</button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setShowAddForm(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Correo</th>
              <th>Proveedor</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>
                  <span className={`${styles.providerBadge} ${user.provider === 'local' ? styles.local : styles.social}`}>
                    {user.provider === 'local' ? '📧 Local' : '🌐 Social'}
                  </span>
                </td>
                <td>{user.role ? (roleLabels[user.role] || user.role) : user.role}</td>
                <td>
                  <select
                    className={styles.roleSelect}
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value={UserRole.EDITOR}>Editor</option>
                    <option value={UserRole.ADMIN}>Administrador</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
