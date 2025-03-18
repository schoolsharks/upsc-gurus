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
import TestForm from "./pages/test/TestForm";
import TestTakerInfo from "./pages/test/TestTakerInfo";
import QuestionComponent from "./components/Question";
import Analysis from "./pages/analysis/Analysis";
import ReviewTest from "./pages/reviewtest/ReviewTest";

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
    <>
    {/* <Analysis/> */}
    {/* <ReviewTest/> */}
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute element={<Home />} />} />
      <Route
        path="/launch-test/:testTemplateId"
        element={<ProtectedRoute element={<TestForm />} />}
      />
      <Route
        path="/confirmation/:testTemplateId"
        element={<ProtectedRoute element={<TestTakerInfo />} />}
      />
      <Route
        path="/test/question/:testId"
        element={<ProtectedRoute element={<QuestionComponent />} />}
      />
    </Routes>
    </>
  );
}

export default App;
