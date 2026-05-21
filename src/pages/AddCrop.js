import React, { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

function AddCrop() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleAddCrop = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/farmer/crop', { name, quantity, price, description });
      setSuccess('Crop added successfully!');
      setTimeout(() => navigate('/my-crops'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add crop');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>🌱 Add New Crop</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleAddCrop}>
        <div>
          <label>Crop Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <div>
          <label>Quantity (kg):</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <div>
          <label>Price (per kg):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#52b788', color: 'white' }}>
          Add Crop
        </button>
      </form>
      <button
        onClick={() => navigate('/dashboard')}
        style={{ width: '100%', padding: '10px', marginTop: '10px', background: 'gray', color: 'white' }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default AddCrop;