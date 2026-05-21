import React, { useState } from 'react';
import API from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const [error, setError] = useState('');
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/auth/signup', { name, email, password, role });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '6px',
    borderRadius: '8px',
    border: '1px solid #b7e4c7',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0faf4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h2 style={{ color: '#2d6a4f', textAlign: 'center', marginBottom: '5px' }}>🌾 Farmer Connect</h2>
        <p style={{ color: '#74c69d', textAlign: 'center', marginBottom: '25px' }}>Create your account today!</p>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#40916c', fontWeight: 'bold' }}>👤 Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#40916c', fontWeight: 'bold' }}>📧 Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#40916c', fontWeight: 'bold' }}>🔒 Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#40916c', fontWeight: 'bold' }}>🎭 Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={inputStyle}
            >
              <option value="farmer">🌱 Farmer</option>
              <option value="buyer">🛒 Buyer</option>
            </select>
          </div>
          <button
            type="submit"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              width: '100%',
              padding: '12px',
              background: hovered ? '#2d6a4f' : '#40916c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              transition: 'background 0.3s',
            }}
          >
            Create Account 🌱
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#555' }}>
          Already have an account?{' '}
          <Link to="/" style={{ color: '#40916c', fontWeight: 'bold' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;