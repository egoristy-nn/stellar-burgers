import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

const ProtectedRoute = ({ element: element }: { element: JSX.Element }) => {
  const isAuthorized = useSelector(
    (state: RootState) => state.user.isAuthorized
  );

  if (!isAuthorized) {
    return <Navigate to='/login' replace />;
  }
  return element;
};

export default ProtectedRoute;
