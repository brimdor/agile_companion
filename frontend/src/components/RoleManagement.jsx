import React, { useEffect, useState } from 'react';

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles] = useState(['System Administrator', 'Project Owner', 'Project Lead', 'Member', 'Guest']);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/users', {
        headers: { 'Authorization': localStorage.getItem('token') }
      });
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`/roles/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ userId, role: newRole })
      });
      if (response.ok) {
        setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
        alert('Role updated successfully');
      } else {
        alert('Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div className="role-management">
      <h2>Role Management</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Current Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={!['System Administrator', 'Project Owner', 'Project Lead'].includes(user.role)}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManagement;
