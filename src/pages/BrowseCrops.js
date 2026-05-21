import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

function BrowseCrops() {
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hovered, setHovered] = useState('');
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const res = await API.get('/api/buyer/crops');
      setCrops(res.data.crops || res.data || []);
    } catch (err) {
      setError('Failed to load crops');
    }
  };

  const handleSearch = async () => {
    try {
      const res = await API.get(`/api/buyer/crops?search=${search}`);
      setCrops(res.data.crops || res.data || []);
    } catch (err) {
      setError('Search failed');
    }
  };

  const handleAddToCart = async (cropId, availableQty) => {
    const quantity = quantities[cropId] || 1;
    if (Number(quantity) > availableQty) {
      setError(`Only ${availableQty} kg available!`);
      setTimeout(() => setError(''), 3000);
      return;
    }
    try {
      await API.post('/api/cart/add', {
        cropId,
        quantity: Number(quantity),
      });
      setSuccess('Added to cart! 🛒');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
      setTimeout(() => setError(''), 3000);
    }
  };

  // ✅ Star display function
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{
          color: i <= rating ? '#f4a261' : '#ddd',
          fontSize: '18px'
        }}>★</span>
      );
    }
    return stars;
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
      <h2 style={{ color: '#2d6a4f' }}>🔍 Browse Crops</h2>
      <p style={{ color: '#74c69d', marginBottom: '20px' }}>Find and order fresh crops!</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div style={{ display: 'flex', marginBottom: '20px', gap: '10px' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search crops..."
          style={{
            flex: 1, padding: '10px', borderRadius: '8px',
            border: '1px solid #b7e4c7', fontSize: '14px', outline: 'none',
          }}
        />
        <button
          onClick={handleSearch}
          onMouseEnter={() => setHovered('search')}
          onMouseLeave={() => setHovered('')}
          style={{
            padding: '10px 20px',
            background: hovered === 'search' ? '#2d6a4f' : '#40916c',
            color: 'white', border: 'none', borderRadius: '8px',
            cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.3s',
          }}
        >
          Search
        </button>
        <button
          onClick={fetchCrops}
          onMouseEnter={() => setHovered('all')}
          onMouseLeave={() => setHovered('')}
          style={{
            padding: '10px 20px',
            background: hovered === 'all' ? '#495057' : '#6c757d',
            color: 'white', border: 'none', borderRadius: '8px',
            cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.3s',
          }}
        >
          All
        </button>
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        onMouseEnter={() => setHovered('back')}
        onMouseLeave={() => setHovered('')}
        style={{
          padding: '10px 20px',
          background: hovered === 'back' ? '#495057' : '#6c757d',
          color: 'white', border: 'none', borderRadius: '8px',
          cursor: 'pointer', fontWeight: 'bold',
          marginBottom: '20px', transition: 'background 0.3s',
        }}
      >
        ← Dashboard
      </button>

      {crops.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '40px',
          background: '#d8f3dc', borderRadius: '12px', color: '#2d6a4f'
        }}>
          <h3>No crops available!</h3>
          <p>Check back later for fresh crops!</p>
        </div>
      ) : (
        crops.map((crop) => (
          <div key={crop._id} style={{
            background: 'white',
            border: '1px solid #b7e4c7',
            padding: '20px',
            marginBottom: '15px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}>
            <h3 style={{ color: '#2d6a4f', margin: '0 0 8px 0' }}>
              🌱 {crop.name}
            </h3>

            {/* ✅ Show Ratings */}
            <div style={{ marginBottom: '8px' }}>
              {renderStars(Math.round(crop.averageRating || 0))}
              <span style={{ color: '#555', fontSize: '14px', marginLeft: '5px' }}>
                {crop.averageRating > 0
                  ? `${crop.averageRating}/5 (${crop.totalRatings} reviews)`
                  : 'No ratings yet'}
              </span>
            </div>

            <p style={{ margin: '4px 0', color: '#555' }}>
              📝 {crop.description}
            </p>
            <p style={{ margin: '4px 0', color: '#555' }}>
              💰 <strong>Price:</strong> ₹{crop.price}/{crop.unit}
            </p>
            <p style={{ margin: '4px 0', color: '#555' }}>
              📦 <strong>Available:</strong> {crop.quantity} {crop.unit}
            </p>
            <p style={{ margin: '4px 0', color: '#555' }}>
              🏷️ <strong>Category:</strong> {crop.category}
            </p>
            <p style={{ margin: '4px 0', color: '#555' }}>
              👨‍🌾 <strong>Farmer:</strong> {crop.farmer?.name}
            </p>

            <div style={{
              display: 'flex', alignItems: 'center',
              gap: '10px', marginTop: '12px'
            }}>
              <input
                type="number"
                min="1"
                max={crop.quantity}
                value={quantities[crop._id] || ''}
                onChange={(e) => setQuantities({
                  ...quantities,
                  [crop._id]: e.target.value
                })}
                placeholder="Qty"
                style={{
                  width: '70px', padding: '8px',
                  borderRadius: '8px', border: '1px solid #b7e4c7',
                  fontSize: '14px', outline: 'none',
                }}
              />
              <button
                onClick={() => handleAddToCart(crop._id, crop.quantity)}
                onMouseEnter={() => setHovered(crop._id)}
                onMouseLeave={() => setHovered('')}
                style={{
                  padding: '10px 20px',
                  background: hovered === crop._id ? '#2d6a4f' : '#40916c',
                  color: 'white', border: 'none', borderRadius: '8px',
                  cursor: 'pointer', fontWeight: 'bold',
                  transition: 'background 0.3s',
                }}
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default BrowseCrops;