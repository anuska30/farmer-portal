import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [hovered, setHovered] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/api/buyer/orders');
        setOrders(res.data.orders || res.data || []);
      } catch (err) {
        setError('Failed to load orders');
      }
    };
    fetchOrders();
  }, []);

  return (
    <div style={{
      maxWidth: '700px',
      margin: '40px auto',
      padding: '30px',
      fontFamily: 'Segoe UI, sans-serif',
      background: '#f9fdf4',
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{ color: '#2d6a4f' }}>📋 My Orders</h2>
      <p style={{ color: '#74c69d', marginBottom: '20px' }}>Track all your orders here!</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button
        onClick={() => navigate('/dashboard')}
        onMouseEnter={() => setHovered('back')}
        onMouseLeave={() => setHovered('')}
        style={{
          padding: '10px 20px',
          background: hovered === 'back' ? '#495057' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '20px',
          transition: 'background 0.3s',
        }}
      >
        ← Dashboard
      </button>

      {orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#d8f3dc',
          borderRadius: '12px',
          color: '#2d6a4f'
        }}>
          <h3>No orders yet!</h3>
          <p>Browse crops and place your first order!</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={{
            background: 'white',
            border: '1px solid #b7e4c7',
            padding: '20px',
            marginBottom: '15px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}>
            <h3 style={{ color: '#2d6a4f', margin: '0 0 8px 0' }}>
              🌱 {order.crop?.name || 'Crop'}
            </h3>
            <p style={{ margin: '4px 0', color: '#555' }}>
              📦 <strong>Quantity:</strong> {order.quantity} kg
            </p>
            <p style={{ margin: '4px 0', color: '#555' }}>
              💰 <strong>Total Price:</strong> ₹{order.totalPrice}
            </p>
            <p style={{ margin: '4px 0', color: '#555' }}>
              📌 <strong>Status:</strong>{' '}
              <span style={{
                color: order.status === 'pending' ? '#e67e22' : '#2d6a4f',
                fontWeight: 'bold'
              }}>
                {order.status}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;