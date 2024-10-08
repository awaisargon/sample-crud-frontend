import React, { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import AuthLayout from '../layout/AuthLayout';  // Layout for protected routes
import PublicLayout from '../layout/PublicLayout'; // Layout for public routes
import LoadingSpinner from '../components/LoadingSpinner'; // Custom spinner component

// Lazy loaded components for code splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));
const CarManagement = lazy(() => import('../pages/CarManagement'));
const Categories = lazy(() => import('../pages/Categories'));
const Signin = lazy(() => import('../pages/Signin'));
const Signup = lazy(() => import('../pages/SignUp'));

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/signin" />;
  }
  return children;
};


const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};


const routes = () => [
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
  },
  {
    path: '/',
    element: (
      <PublicRoute>
        <PublicLayout/>
      </PublicRoute>
    ), // Public layout
    children: [
      { path: 'signin', element: <Signin /> },
      { path: 'signup', element: <Signup /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <AuthLayout/>
      </ProtectedRoute>
    ), // Protected layout
    children: [
      { path: '', element: <Dashboard /> },
      { path: 'car-management', element: <CarManagement /> },
      { path: 'categories', element: <Categories /> },
    ],
  },
  { path: '*', element: <Navigate to="/signin" /> }
];

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {useRoutes(routes())}
    </Suspense>
  );
}
