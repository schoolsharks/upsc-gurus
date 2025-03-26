import React, { useState, FormEvent, ChangeEvent } from "react";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { resetPassword } from "../../redux/reducers/userReducer";

const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { token } = useParams<{ token: string }>();

  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<boolean>(false);
  const [resetError, setResetError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPasswordError(false);
    setConfirmPasswordError(false);
    setResetError("");

    if (password === "") setPasswordError(true);
    if (confirmPassword === "") setConfirmPasswordError(true);
    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      setResetError("Passwords do not match.");
    }

    if (password && confirmPassword && token && password === confirmPassword) {
      setLoading(true); 

      try {
        const response = await dispatch(resetPassword({ password, confirmPassword, token }));

        if (response) {
          setSuccess(true); 
          setLoading(false);
        }
      } catch (error) {
        setResetError("An error occurred while resetting your password.");
        setLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 400, p: 3 }}>
        {success ? (
          // Success message after password reset
          <Box>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Password Reset Successful!
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 3 }}>
              Your password has been successfully reset. You can now log in with your new password.
            </Typography>
            <Button variant="contained" fullWidth onClick={() => navigate("/")}>
              Go to Login
            </Button>
          </Box>
        ) : (
          <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
            <h2>Reset Password</h2>

            <TextField
              label="New Password"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              variant="outlined"
              color="secondary"
              type="password"
              sx={{ mb: 3, mt: 4 }}
              fullWidth
              value={password}
              error={passwordError}
              helperText={passwordError ? "Password is required" : ""}
            />

            <TextField
              label="Confirm Password"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
              variant="outlined"
              color="secondary"
              type="password"
              sx={{ mb: 3 }}
              fullWidth
              value={confirmPassword}
              error={confirmPasswordError}
              helperText={confirmPasswordError ? "Passwords must match" : ""}
            />

            {/* Reset Error Message */}
            {resetError && <Typography color="error">{resetError}</Typography>}

            <Button variant="contained" type="submit" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} color="secondary" /> : "Reset Password"}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResetPasswordForm;
