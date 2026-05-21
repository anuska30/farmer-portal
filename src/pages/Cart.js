import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get('/api/cart');
      setCart(res.data.cart || null);
    } catch (err) {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (cropId) => {
    const confirmed = window.confirm('Remove this item from cart?');
    if (!confirmed) return;
    try {
      await API.delete(`/api/cart/remove/${cropId}`);
      fetchCart();
      setSuccess('Item removed! ✅');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    const confirmed = window.confirm('Clear entire cart?');
    if (!confirmed) return;
    try {
      await API.delete('/api/cart/clear');
      setCart(null);
      setSuccess('Cart cleared! ✅');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to clear cart');
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      setError('Cart is empty!');
      return;
    }
    try {
      for (const item of cart.items) {
        await API.post('/api/buyer/order', {
          cropId: item.crop._id,
          quantity: item.quantity,
          deliveryAddress: 'Default Address, India'
        });
      }
      await API.delete('/api/cart/clear');
      setCart(null);
      setSuccess('🎉 All orders placed successfully!');
      setTimeout(() => navigate('/my-orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place orders');
    }
  };

  // ✅ NEW: Razorpay Payment Handler
  const handleRazorpayPayment = async () => {
    if (!cart || cart.items.length === 0) {
      setError('Cart is empty!');
      return;
    }

    setPaymentLoading(true);
    setError('');

    try {
      // Step 1: Create order on backend
      const orderRes = await API.post('/api/payment/create-order', {
        amount: cart.totalPrice
      });

      const { order } = orderRes.data;

      // Step 2: Open Razorpay popup
      const options = {
        key: 'rzp_test_SrZBQ9LuBcdIo7',
        amount: order.amount,
        currency: order.currency,
        name: 'Farmer Connect Portal',
        description: 'Crop Payment',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Step 3: Verify payment
            const verifyRes = await API.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              // Step 4: Place orders after payment success
              for (const item of cart.items) {
                await API.post('/api/buyer/order', {
                  cropId: item.crop._id,
                  quantity: item.quantity,
                  deliveryAddress: 'Default Address, India',
                  paymentId: response.razorpay_payment_id,
                  paymentStatus: 'paid'
                });
              }
              await API.delete('/api/cart/clear');
              setCart(null);
              setSuccess('🎉 Payment successful! Orders placed!');
              setTimeout(() => navigate('/my-orders'), 2000);
            }
          } catch (err) {
            setError('Payment verification failed!');
          }
        },
        prefill: {
          name: 'Farmer Connect User',
          email: 'user@farmerconnect.com',
        },
        theme: {
          color: '#40916c'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed!');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f9fdf4',
        fontFamily: 'Segoe UI, sans-serif',
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
          <p style={{ color: '#40916c', fontWeight: 'bold' }}>Loading cart...</p>
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
      <h2 style={{ color: '#2d6a4f' }}>🛒 My Cart</h2>
      <p style={{ color: '#74c69d', marginBottom: '20px' }}>Review your items before ordering!</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <button
        onClick={() => navigate('/browse-crops')}
        onMouseEnter={() => setHovered('browse')}
        onMouseLeave={() => setHovered('')}
        style={{
          padding: '10px 20px',
          background: hovered === 'browse' ? '#2d6a4f' : '#40916c',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginRight: '10px',
          marginBottom: '20px',
          transition: 'background 0.3s',
        }}
      >
        ← Continue Shopping
      </button>

      {!cart || cart.items.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#d8f3dc',
          borderRadius: '12px',
          color: '#2d6a4f'
        }}>
          <h3>🛒 Your cart is empty!</h3>
          <p>Browse crops and add items to cart</p>
        </div>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div key={item._id} style={{
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
                <h3 style={{ color: '#2d6a4f', margin: '0 0 8px 0' }}>🌱 {item.crop?.name}</h3>
                <p style={{ margin: '4px 0', color: '#555' }}>📦 <strong>Quantity:</strong> {item.quantity} kg</p>
                <p style={{ margin: '4px 0', color: '#555' }}>💰 <strong>Price:</strong> ₹{item.price} per kg</p>
                <p style={{ margin: '4px 0', color: '#2d6a4f', fontWeight: 'bold' }}>
                  Subtotal: ₹{item.price * item.quantity}
                </p>
              </div>
              <button
                onClick={() => handleRemove(item.crop?._id)}
                onMouseEnter={() => setHovered(item._id)}
                onMouseLeave={() => setHovered('')}
                style={{
                  padding: '10px 16px',
                  background: hovered === item._id ? '#c1121f' : '#e63946',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'background 0.3s',
                }}
              >
                🗑️ Remove
              </button>
            </div>
          ))}

          <div style={{
            background: '#d8f3dc',
            padding: '20px',
            borderRadius: '12px',
            marginTop: '20px',
          }}>
            <h3 style={{ color: '#2d6a4f', margin: '0 0 15px 0' }}>
              💰 Total: ₹{cart.totalPrice}
            </h3>

            {/* ✅ NEW: Pay with Razorpay Button */}
            <button
              onClick={handleRazorpayPayment}
              onMouseEnter={() => setHovered('razorpay')}
              onMouseLeave={() => setHovered('')}
              disabled={paymentLoading}
              style={{
                padding: '12px 24px',
                background: paymentLoading ? '#aaa' : hovered === 'razorpay' ? '#1a5276' : '#2874a6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: paymentLoading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                marginRight: '10px',
                marginBottom: '10px',
                transition: 'background 0.3s',
              }}
            >
              {paymentLoading ? '⏳ Processing...' : '💳 Pay with Razorpay'}
            </button>

            <button
              onClick={handlePlaceOrder}
              onMouseEnter={() => setHovered('order')}
              onMouseLeave={() => setHovered('')}
              style={{
                padding: '12px 24px',
                background: hovered === 'order' ? '#2d6a4f' : '#40916c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                marginRight: '10px',
                marginBottom: '10px',
                transition: 'background 0.3s',
              }}
            >
              ✅ Place Order (COD)
            </button>

            <button
              onClick={handleClearCart}
              onMouseEnter={() => setHovered('clear')}
              onMouseLeave={() => setHovered('')}
              style={{
                padding: '12px 24px',
                background: hovered === 'clear' ? '#c1121f' : '#e63946',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                marginBottom: '10px',
                transition: 'background 0.3s',
              }}
            >
              🗑️ Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;