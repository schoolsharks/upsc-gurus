import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  Stack,
  Typography,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
} from "@mui/material";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { logout, setUserInfo, TestTypes } from "../../redux/reducers/userReducer";
import { MdMenu } from "react-icons/md";
import userApi from "../../api/userApi";
import useCouncelling from "../../hooks/useCouncelling";
import Sidebar from "../../components/home/Sidebar";
import DashboardContent from "../../components/home/DashboardContent";
import logo from "../../assets/logo.webp";

const Home: React.FC = () => {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [testType, setTestType] = useState<TestTypes>(TestTypes.TEST_SERIES);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { completedTests, inProgressTests, allTests, name } = useSelector(
    (state: RootState) => state.user
  );

  const { handleFreeCouncellingCall, handleMentorshipAppointment } =
    useCouncelling();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userApi.get("/test/userTestInfo");
        dispatch(setUserInfo(response.data.user));
      } catch (err: any) {
        dispatch(setUserInfo(err));
        console.log(
          err.response?.data?.message || "Failed to fetch user information."
        );
      }
    };

    fetchUserInfo();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
    setLogoutDialogOpen(false);
  };

  const handleResumeTest = (testMode: string, testId: string) => {
    if (testMode === "TEST") {
      navigate(`/test/question/${testId}`);
    } else {
      navigate(`/learn/test/question/${testId}`);
    }
  };

  // Function to get user initials
  const getUserInitials = () => {
    if (!name) return "";
    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  // Function to get first name
  const getFirstName = () => {
    if (!name) return "";
    return name.split(" ")[0];
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - 280px)` },
          ml: { sm: `280px` },
          backgroundColor: "white",
          color: "black",
          boxShadow: "none",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MdMenu />
          </IconButton>
          <Box
            onClick={() => navigate("/")}
            className="focus:outline-none"
            sx={{ flexGrow: 1 }}
          >
            <img
              src={logo}
              alt="UPSC Gurus Logo"
              className="logo cursor-pointer"
            />
          </Box>
          
          {/* User Info Section */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {getFirstName()}
            </Typography>
            <Avatar
              sx={{
                bgcolor: "#FFBD00",
                color: "white",
                width: 32,
                height: 32,
                fontSize: "0.875rem",
              }}
            >
              {getUserInitials()}
            </Avatar>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Rest of your component remains the same */}
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        testType={testType}
        setTestType={setTestType}
        handleFreeCouncellingCall={handleFreeCouncellingCall}
        handleMentorshipAppointment={handleMentorshipAppointment}
        handleLogout={() => setLogoutDialogOpen(true)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: {xs:0,sm: 3},
          width: { sm: `calc(100% - 280px)` },
          pt: { xs: 8, sm: 3 },
        }}
      >
        <DashboardContent
          testType={testType}
          inProgressTests={inProgressTests}
          allTests={allTests}
          completedTests={completedTests}
          handleResumeTest={handleResumeTest}
        />
      </Box>

      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
        <Stack sx={{ padding: "2rem", maxWidth: "400px" }}>
          <Typography fontSize="1.5rem" fontWeight={"600"}>
            Confirm Logout
          </Typography>
          <Typography fontSize="1rem" color={theme.palette.text.secondary}>
            Are you sure you want to log out? You will not be able to login
            again without credentials
          </Typography>
          <Stack direction={"row"} gap={"1rem"} flex="1" marginTop={"1rem"}>
            <Button
              variant="outlined"
              onClick={() => setLogoutDialogOpen(false)}
              sx={{
                borderRadius: "50px",
                border: "1px solid black",
                color: "black",
              }}
            >
              No
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: "50px", background: "black" }}
              onClick={handleLogout}
            >
              Yes
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </Box>
  );
};

export default Home;