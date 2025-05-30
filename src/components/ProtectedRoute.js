import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
