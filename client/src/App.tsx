import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store";
import { AuthStates, setUser } from "./redux/reducers/userReducer";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./pages/home/Home";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const userToken = localStorage.getItem("accessToken");

      if (userToken) {
        dispatch(setUser({ authState: AuthStates.AUTHENTICATED }));
      } else {
        dispatch(setUser({ authState: AuthStates.IDLE }));
        navigate("/login", { replace: true });
      }

      setLoading(false);
    };

    initializeAuth();
  }, [dispatch, navigate]);

  if (loading) return <Loader />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute element={<Home />} />} />
    </Routes>
  );
}

export default App;
