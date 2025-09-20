import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  
  if (!userInfo) {
    // Save the attempted location for redirecting after login
    localStorage.setItem('redirectLocation', JSON.stringify(location));
    return <Navigate to="/auth/login" replace />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;
