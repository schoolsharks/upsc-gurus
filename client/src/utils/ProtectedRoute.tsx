import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { AuthStates } from "../redux/reducers/userReducer";

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { authState } = useSelector((state: RootState) => state.user);

  if (authState === AuthStates.IDLE || authState === undefined) {
    return <Navigate to="/login" replace />;
  }

  return authState === AuthStates.AUTHENTICATED ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
