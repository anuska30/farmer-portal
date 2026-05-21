import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateCrop() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hovered, setHovered] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const res = await API.get(`/api/farmer/crop/${id}`);
        const crop = res.data.crop || res.data;
        setName(crop.name);
        setQuantity(crop.quantity);
        setPrice(crop.price);
        setDescription(crop.description);
      } catch (err) {
        setError('Failed to load crop details');
      }
    };
    fetchCrop();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/farmer/crop/${id}`, { name, quantity, price, description });
      setSuccess('Crop updated successfully!');
      setTimeout(() => navigate('/my-crops'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update crop');
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
      <h2 style={{ color: '#2d6a4f' }}>✏️ Update Crop</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleUpdate}>
        <div>
          <label style={{ color: '#40916c', fontWeight: 'bold' }}>Crop Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ color: '#40916c', fontWeight: 'bold' }}>Quantity (kg):</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ color: '#40916c', fontWeight: 'bold' }}>Price (per kg):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ color: '#40916c', fontWeight: 'bold' }}>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, height: '80px' }}
          />
        </div>
        <button
          type="submit"
          onMouseEnter={() => setHovered('update')}
          onMouseLeave={() => setHovered('')}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '10px',
            background: hovered === 'update' ? '#2d6a4f' : '#40916c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s',
          }}
        >
          ✏️ Update Crop
        </button>
        <button
          type="button"
          onClick={() => navigate('/my-crops')}
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
          ← Back to My Crops
        </button>
      </form>
    </div>
  );
}

export default UpdateCrop;