import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

function BankDetails() {
  const [form, setForm] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  });
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hovered, setHovered] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const res = await API.get('/api/farmer/bank-details');
      if (res.data.bankDetails) {
        setForm({
          accountHolderName: res.data.bankDetails.accountHolderName || '',
          accountNumber: res.data.bankDetails.accountNumber || '',
          ifscCode: res.data.bankDetails.ifscCode || '',
          bankName: res.data.bankDetails.bankName || ''
        });
      }
      if (res.data.earnings) {
        setEarnings(res.data.earnings);
      }
    } catch (err) {
      setError('Failed to load bank details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.accountHolderName || !form.accountNumber || !form.ifscCode || !form.bankName) {
      setError('All fields are required!');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await API.post('/api/farmer/bank-details', form);
      setSuccess('✅ Bank details saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bank details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', minHeight: '100vh',
        background: '#f9fdf4', fontFamily: 'Segoe UI, sans-serif'
      }}>
        <p style={{ color: '#40916c', fontWeight: 'bold' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '700px', margin: '40px auto', padding: '30px',
      fontFamily: 'Segoe UI, sans-serif', background: '#f9fdf4',
      borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#2d6a4f' }}>🏦 Bank Details & Earnings</h2>
      <p style={{ color: '#74c69d', marginBottom: '20px' }}>
        Add your bank details to receive payments!
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {earnings && (
        <div style={{
          background: '#d8f3dc', padding: '20px',
          borderRadius: '12px', marginBottom: '30px'
        }}>
          <h3 style={{ color: '#2d6a4f', marginBottom: '15px' }}>💰 Earnings Summary</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{
              background: 'white', padding: '15px', borderRadius: '10px',
              flex: 1, textAlign: 'center'
            }}>
              <p style={{ color: '#555', margin: '0 0 5px 0' }}>Total Earnings</p>
              <h3 style={{ color: '#2d6a4f', margin: 0 }}>₹{earnings.totalEarnings || 0}</h3>
            </div>
            <div style={{
              background: 'white', padding: '15px', borderRadius: '10px',
              flex: 1, textAlign: 'center'
            }}>
              <p style={{ color: '#555', margin: '0 0 5px 0' }}>Pending Amount</p>
              <h3 style={{ color: '#e63946', margin: 0 }}>₹{earnings.pendingAmount || 0}</h3>
            </div>
            <div style={{
              background: 'white', padding: '15px', borderRadius: '10px',
              flex: 1, textAlign: 'center'
            }}>
              <p style={{ color: '#555', margin: '0 0 5px 0' }}>Paid Amount</p>
              <h3 style={{ color: '#40916c', margin: 0 }}>₹{earnings.paidAmount || 0}</h3>
            </div>
          </div>
        </div>
      )}

      <div style={{
        background: 'white', padding: '25px',
        borderRadius: '12px', border: '1px solid #b7e4c7'
      }}>
        <h3 style={{ color: '#2d6a4f', marginBottom: '20px' }}>🏦 Bank Account Details</h3>

        {[
          { label: 'Account Holder Name', name: 'accountHolderName', placeholder: 'Enter full name as per bank' },
          { label: 'Account Number', name: 'accountNumber', placeholder: 'Enter account number' },
          { label: 'IFSC Code', name: 'ifscCode', placeholder: 'e.g. SBIN0001234' },
          { label: 'Bank Name', name: 'bankName', placeholder: 'e.g. State Bank of India' }
        ].map((field) => (
          <div key={field.name} style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block', color: '#2d6a4f',
              fontWeight: 'bold', marginBottom: '5px'
            }}>
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid #b7e4c7', borderRadius: '8px',
                fontSize: '14px', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        ))}

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSubmit}
            disabled={saving}
            onMouseEnter={() => setHovered('save')}
            onMouseLeave={() => setHovered('')}
            style={{
              padding: '12px 24px',
              background: saving ? '#aaa' : hovered === 'save' ? '#2d6a4f' : '#40916c',
              color: 'white', border: 'none', borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontWeight: 'bold', fontSize: '16px',
              transition: 'background 0.3s'
            }}
          >
            {saving ? '⏳ Saving...' : '💾 Save Bank Details'}
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            onMouseEnter={() => setHovered('back')}
            onMouseLeave={() => setHovered('')}
            style={{
              padding: '12px 24px',
              background: hovered === 'back' ? '#2d6a4f' : '#74c69d',
              color: 'white', border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
              transition: 'background 0.3s'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div style={{
        background: '#fff3cd', padding: '15px',
        borderRadius: '12px', marginTop: '20px',
        border: '1px solid #ffc107'
      }}>
        <h4 style={{ color: '#856404', margin: '0 0 10px 0' }}>📊 Commission Information</h4>
        <p style={{ color: '#856404', margin: 0 }}>
          Platform commission: <strong>10%</strong> per sale<br />
          Example: If you sell crops worth ₹1000, you receive ₹900
        </p>
      </div>
    </div>
  );
}

export default BankDetails;