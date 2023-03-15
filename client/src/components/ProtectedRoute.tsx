import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  authKey: boolean;
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  authKey,
  children,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authKey) {
      return navigate('/sign-in', { replace: true });
    }
  });

  return <>{children}</>;
};

export default ProtectedRoute;
