import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddCrop from './pages/AddCrop';
import MyCrops from './pages/MyCrops';
import BrowseCrops from './pages/BrowseCrops';
import MyOrders from './pages/MyOrders';
import UpdateCrop from './pages/UpdateCrop';
import ChangePassword from './pages/ChangePassword';
import Cart from './pages/Cart';
import BankDetails from './pages/BankDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-crop" element={<AddCrop />} />
        <Route path="/my-crops" element={<MyCrops />} />
        <Route path="/browse-crops" element={<BrowseCrops />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/update-crop/:id" element={<UpdateCrop />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/bank-details" element={<BankDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
