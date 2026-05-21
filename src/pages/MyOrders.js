import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [hovered, setHovered] = useState('');
  const [ratingModal, setRatingModal] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [ratedOrders, setRatedOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/api/buyer/orders');
      setOrders(res.data.orders || res.data || []);
    } catch (err) {
      setError('Failed to load orders');
    }
  };

  const handleRating = async () => {
    if (!rating) {
      setRatingError('Please select a star rating!');
      return;
    }
    try {
      await API.post('/api/rating/add', {
        cropId: ratingModal.crop._id,
        orderId: ratingModal._id,
        rating,
        comment
      });
      setRatingSuccess('✅ Rating submitted successfully!');
      setRatedOrders([...ratedOrders, ratingModal._id]);
      setTimeout(() => {
        setRatingModal(null);
        setRating(0);
        setComment('');
        setRatingSuccess('');
        setRatingError('');
      }, 2000);
    } catch (err) {
      setRatingError(err.response?.data?.message || 'Failed to submit rating');
    }
  };

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

            {/* ✅ Rate Button */}
            {!ratedOrders.includes(order._id) ? (
              <button
                onClick={() => {
                  setRatingModal(order);
                  setRating(0);
                  setComment('');
                  setRatingError('');
                }}
                onMouseEnter={() => setHovered(`rate-${order._id}`)}
                onMouseLeave={() => setHovered('')}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  background: hovered === `rate-${order._id}` ? '#f4a261' : '#e9c46a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'background 0.3s'
                }}
              >
                ⭐ Rate this Crop
              </button>
            ) : (
              <p style={{ color: '#40916c', marginTop: '10px', fontWeight: 'bold' }}>
                ✅ Rated!
              </p>
            )}
          </div>
        ))
      )}

      {/* ✅ Rating Modal */}
      {ratingModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            width: '400px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ color: '#2d6a4f', marginBottom: '10px' }}>
              ⭐ Rate {ratingModal.crop?.name}
            </h3>
            <p style={{ color: '#555', marginBottom: '15px' }}>
              How would you rate this crop?
            </p>

            {ratingError && <p style={{ color: 'red' }}>{ratingError}</p>}
            {ratingSuccess && <p style={{ color: 'green' }}>{ratingSuccess}</p>}

            {/* Star Rating */}
            <div style={{ marginBottom: '15px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    fontSize: '36px',
                    cursor: 'pointer',
                    color: star <= rating ? '#f4a261' : '#ddd',
                    transition: 'color 0.2s'
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <p style={{ color: '#555', marginBottom: '5px' }}>
              {rating === 1 ? '😞 Poor' :
               rating === 2 ? '😐 Fair' :
               rating === 3 ? '🙂 Good' :
               rating === 4 ? '😊 Very Good' :
               rating === 5 ? '🤩 Excellent!' : 'Select rating'}
            </p>

            {/* Comment */}
            <textarea
              placeholder="Write a comment (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #b7e4c7',
                marginBottom: '15px',
                fontSize: '14px',
                boxSizing: 'border-box',
                resize: 'vertical',
                minHeight: '80px'
              }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleRating}
                style={{
                  padding: '10px 20px',
                  background: '#40916c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                ✅ Submit Rating
              </button>
              <button
                onClick={() => {
                  setRatingModal(null);
                  setRating(0);
                  setComment('');
                  setRatingError('');
                }}
                style={{
                  padding: '10px 20px',
                  background: '#e63946',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                ✖ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrders;