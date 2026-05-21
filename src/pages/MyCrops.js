import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

function MyCrops() {
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState('');
  const [hovered, setHovered] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await API.get('/api/farmer/my-crops');
        setCrops(res.data.crops || res.data || []);
      } catch (err) {
        setError('Failed to load crops');
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this crop?');
    if (!confirmed) return;
    try {
      await API.delete(`/api/farmer/crop/${id}`);
      setCrops(crops.filter((crop) => crop._id !== id));
    } catch (err) {
      setError('Failed to delete crop');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: 'Segoe UI, sans-serif',
        background: '#f9fdf4',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #b7e4c7',
            borderTop: '5px solid #40916c',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px',
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#40916c', fontWeight: 'bold' }}>Loading crops...</p>
        </div>
      </div>
    );
  }

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
      <h2 style={{ color: '#2d6a4f', marginBottom: '5px' }}>🌾 My Crops</h2>
      <p style={{ color: '#74c69d', marginBottom: '20px' }}>Manage your listed crops</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/add-crop')}
          onMouseEnter={() => setHovered('add')}
          onMouseLeave={() => setHovered('')}
          style={{
            padding: '10px 20px',
            background: hovered === 'add' ? '#2d6a4f' : '#40916c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginRight: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'background 0.3s',
          }}
        >
          ➕ Add New Crop
        </button>
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
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'background 0.3s',
          }}
        >
          ← Dashboard
        </button>
      </div>

      {crops.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#d8f3dc',
          borderRadius: '12px',
          color: '#2d6a4f'
        }}>
          <h3>No crops added yet!</h3>
          <p>Click "Add New Crop" to get started</p>
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h3 style={{ color: '#2d6a4f', margin: '0 0 8px 0' }}>🌱 {crop.name}</h3>
              <p style={{ margin: '4px 0', color: '#555' }}>📦 <strong>Quantity:</strong> {crop.quantity} kg</p>
              <p style={{ margin: '4px 0', color: '#555' }}>💰 <strong>Price:</strong> ₹{crop.price} per kg</p>
              <p style={{ margin: '4px 0', color: '#555' }}>📝 <strong>Description:</strong> {crop.description}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => navigate(`/update-crop/${crop._id}`)}
                onMouseEnter={() => setHovered('edit'+crop._id)}
                onMouseLeave={() => setHovered('')}
                style={{
                  padding: '10px 16px',
                  background: hovered === 'edit'+crop._id ? '#1d3557' : '#457b9d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  transition: 'background 0.3s',
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(crop._id)}
                onMouseEnter={() => setHovered(crop._id)}
                onMouseLeave={() => setHovered('')}
                style={{
                  padding: '10px 16px',
                  background: hovered === crop._id ? '#c1121f' : '#e63946',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  transition: 'background 0.3s',
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyCrops;