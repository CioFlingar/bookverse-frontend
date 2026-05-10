// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo || !userInfo.token) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children;
}