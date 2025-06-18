import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';


const ProtectedRoute = () => {
  const { isAuthenticated, status } = useSelector((state: RootState) => state.auth);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/register" replace />;
};

export default ProtectedRoute;