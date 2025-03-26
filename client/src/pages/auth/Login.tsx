import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  useTheme,
  Alert,
} from "@mui/material";
import { AppDispatch, RootState } from "../../redux/store";
import { setUser} from "../../redux/reducers/userReducer";
import { login } from "../../redux/actions/userActions";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo-vertical.webp";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const { error, loading } = useSelector((state: RootState) => state.user);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      dispatch(setUser({ error: "" }));
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name as keyof typeof errors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [dispatch]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) {
        return;
      }

      dispatch(setUser({ error: "" }));

      try {
        const response = await dispatch(login(formData)).unwrap()
        if (response.accessToken) {
          navigate("/");
        }
      } catch (error) {
        dispatch(setUser({ error: "Error occurred" }));
      }
    },
    [dispatch, formData, validateForm]
  );

  return (
    <div className="mt-12">
    <div><img src={logo} alt="" className="mx-auto  w-[100px] sm:w-[120px]"/></div>
    <Container>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          maxWidth: "350px",
          margin: "50px auto",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          // bgcolor: "background.paper",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3, color:"black"}}>
          Login
        </Typography>

        <TextField
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          disabled={loading}
        />

        <TextField
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          sx={{ marginTop: "12px" }}
          disabled={loading}
        />

        <NavLink
          to="/forget-password"
          style={{
            color: theme.palette.primary.main,
            textDecoration: "none",
            marginTop: "12px",
            display: "flex",
            alignSelf: "flex-end",
          }}
        >
          Forget Password?
        </NavLink>

        {error && (
          <Alert severity="error" sx={{ width: "100%", my: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            mt: 2,
            mb: 2,
            py: 1.5,
            position: "relative",
            "&.Mui-disabled": {
              backgroundColor: theme.palette.primary.main,
              color: "white",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{
                  color: "white",
                }}
              />
            ) : (
              "Login"
            )}
          </Box>
        </Button>
      </Box>
    </Container>
    </div>
  );
};

export default Login;
