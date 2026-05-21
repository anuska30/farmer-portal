import React, { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hovered, setHovered] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match!');
      return;
    }
    try {
      await API.put('/api/auth/change-password', { currentPassword: oldPassword, newPassword });
      setSuccess('Password changed successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '8px 0',
    borderRadius: '8px',
    border: '1px solid #b7e4c7',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '50px auto',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      background: '#f9fdf4',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h2 style={{ color: '#2d6a4f' }}>🔑 Change Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleChangePassword}>
        <div>
          <label style={{ color: '#40916c', fontWeight: 'bold' }}>Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ color: '#40916c', fontWeight: 'bold' }}>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ color: '#40916c', fontWeight: 'bold' }}>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            style={inputStyle}
          />
        </div>
        <button
          type="submit"
          onMouseEnter={() => setHovered('change')}
          onMouseLeave={() => setHovered('')}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '10px',
            background: hovered === 'change' ? '#2d6a4f' : '#40916c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s',
          }}
        >
          🔑 Change Password
        </button>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          onMouseEnter={() => setHovered('back')}
          onMouseLeave={() => setHovered('')}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '10px',
            background: hovered === 'back' ? '#495057' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s',
          }}
        >
          ← Back to Dashboard
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;