import React, { useState } from "react";
import Sidebar from "./Sidebar";
import axios from 'axios';

const ChangePassword = ({ userId }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post('/api/change-password', { userId, oldPassword, newPassword });
      setMessage(res.data.message);
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error changing password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Change Password</h2>
      <label>Old Password:</label>
      <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
      <label>New Password:</label>
      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
      <button type="submit">Change Password</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ChangePassword;