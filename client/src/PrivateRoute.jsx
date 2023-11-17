import React from 'react';
import useAuth from './providers/useAuth';
import { Skeleton } from './components/ui/skeleton';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { user, userLoading } = useAuth();
    if (userLoading) {
        return <Skeleton className="h-[500px] w-full" />;
    }
    if (user) {
        return children;
    }
    return <Navigate to={'/login'} />;
};

export default PrivateRoute;