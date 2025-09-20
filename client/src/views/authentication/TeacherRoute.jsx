import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TeacherRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  if (!userInfo) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (userInfo.role !== 'teacher') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default TeacherRoute;
