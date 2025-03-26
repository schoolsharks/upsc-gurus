import React, { useState, FormEvent, ChangeEvent } from "react";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { forgetPassword } from "../../redux/reducers/userReducer";

const ForgetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [forgetPasswordError, setForgetPasswordError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setEmailError(false);
    setForgetPasswordError("");
    setLoading(true);

    if (email === "") {
      setEmailError(true);
      setLoading(false);
    }

    if (email) {
      // console.log("pathname", pathname)
      try {
        // console.log("user path ", location.pathname);
        const response = await dispatch(forgetPassword({ email }));
        if (response) {
          setIsSuccess(true);
          setLoading(false);
          // navigate("/displaying page Reset link shared on registered mailId");
        }
      } catch (error) {
        setForgetPasswordError("An unexpected error occurred.");
        setLoading(false);
      }
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!isSuccess ? (
          <>
            <Typography variant="h5" gutterBottom>
              Forget Password
            </Typography>

            <TextField
              label="Email"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
              variant="outlined"
              color="secondary"
              type="email"
              sx={{ mb: 3, mt: 4 }}
              fullWidth
              value={email}
              error={emailError}
              helperText={emailError ? "Email is required" : ""}
            />
            {forgetPasswordError && (
              <Typography sx={{ color: "red", mb: 2 }}>
                {forgetPasswordError}
              </Typography>
            )}
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Submit"
              )}
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom color="primary">
              Reset Link Sent!
            </Typography>
            <Typography variant="body1" paragraph>
              A password reset link has been shared to your registered email
              address. Please check your inbox to reset your password.
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/")}
              sx={{ mt: 3 }}
            >
              Go Back to Login
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ForgetPasswordForm;
