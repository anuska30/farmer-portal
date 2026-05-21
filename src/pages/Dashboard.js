import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [hovered, setHovered] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/api/auth/me');
        setUser(res.data);
      } catch (err) {
        setError('Session expired. Please login again.');
        navigate('/');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const btnStyle = (name, bg, hoverBg) => ({
    padding: '12px 24px',
    background: hovered === name ? hoverBg : bg,
    color: 'white',
    margin: '8px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold',
    transition: 'background 0.3s',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  });

  return (
    <div style={{
      maxWidth: '650px',
      margin: '50px auto',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      background: '#f9fdf4',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h2 style={{ color: '#2d6a4f' }}>🌾 Farmer Connect - Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user ? (
        <div>
          <div style={{ background: '#d8f3dc', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
            <p><strong>👤 Name:</strong> {user.name}</p>
            <p><strong>📧 Email:</strong> {user.email}</p>
            <p><strong>🎭 Role:</strong> {user.role}</p>
          </div>
          <hr style={{ borderColor: '#b7e4c7' }} />
          <h3 style={{ color: '#40916c' }}>Quick Actions</h3>

          {user.role === 'farmer' && (
  <div>
    <button
      onClick={() => navigate('/my-crops')}
      style={btnStyle('mycrops', '#40916c', '#2d6a4f')}
      onMouseEnter={() => setHovered('mycrops')}
      onMouseLeave={() => setHovered('')}
    >
      🌱 My Crops
    </button>
    <button
      onClick={() => navigate('/add-crop')}
      style={btnStyle('addcrop', '#52b788', '#40916c')}
      onMouseEnter={() => setHovered('addcrop')}
      onMouseLeave={() => setHovered('')}
    >
      ➕ Add Crop
    </button>
    <button
      onClick={() => navigate('/bank-details')}
      style={btnStyle('bank', '#2874a6', '#1a5276')}
      onMouseEnter={() => setHovered('bank')}
      onMouseLeave={() => setHovered('')}
    >
      🏦 Bank Details & Earnings
    </button>
  </div>
)}

          {user.role === 'buyer' && (
            <div>
              <button
                onClick={() => navigate('/browse-crops')}
                style={btnStyle('browse', '#40916c', '#2d6a4f')}
                onMouseEnter={() => setHovered('browse')}
                onMouseLeave={() => setHovered('')}
              >
                🔍 Browse Crops
              </button>
               <button
                onClick={() => navigate('/cart')}
                style={btnStyle('cart', '#e9c46a', '#f4a261')}
                onMouseEnter={() => setHovered('cart')}
                onMouseLeave={() => setHovered('')}
               >
               🛒 My Cart
              </button>
              <button
                onClick={() => navigate('/my-orders')}
                style={btnStyle('orders', '#52b788', '#40916c')}
                onMouseEnter={() => setHovered('orders')}
                onMouseLeave={() => setHovered('')}
              >
                📋 My Orders
              </button>
            </div>
          )}

          <br />
          <button
            onClick={() => navigate('/change-password')}
            style={btnStyle('changepass', '#457b9d', '#1d3557')}
            onMouseEnter={() => setHovered('changepass')}
            onMouseLeave={() => setHovered('')}
          >
            🔑 Change Password
          </button>
          <button
            onClick={handleLogout}
            style={btnStyle('logout', '#e63946', '#c1121f')}
            onMouseEnter={() => setHovered('logout')}
            onMouseLeave={() => setHovered('')}
          >
            🚪 Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;