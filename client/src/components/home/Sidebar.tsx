import React from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { MdLogout } from "react-icons/md";
import { TestTypes } from "../../redux/reducers/userReducer";
import { ArrowForwardIos } from "@mui/icons-material";

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  testType: TestTypes;
  setTestType: (type: TestTypes) => void;
  handleFreeCouncellingCall: () => void;
  handleMentorshipAppointment: () => void;
  handleLogout: () => void;
}

const drawerWidth = 280;

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  handleDrawerToggle,
  testType,
  setTestType,
  handleFreeCouncellingCall,
  handleMentorshipAppointment,
  handleLogout,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const drawerContent = (
    <Box sx={{ 
      p: 2, 
      bgcolor: "#000", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column",
      color: "#fff",
      position:isMobile ? "static" : "fixed",
      width:isMobile?"100%":drawerWidth,
      zIndex:theme.zIndex.drawer
    }}>
      {/* My Courses Section */}
      <Typography variant="h6" sx={{ 
        fontWeight: 600, 
        mb: 2,
        color: "#fff"
      }}>
        My Courses
      </Typography>
      
      <Tabs 
        value={testType} 
        onChange={(_, newValue) => setTestType(newValue)}
        orientation="vertical"
        sx={{
          "& .MuiTabs-indicator": {
            left: 0,
            width: 4,
            backgroundColor: "#fff"
          },
          "& .MuiTab-root": {
            color: "rgba(255, 255, 255, 0.7)",
            "&.Mui-selected": {
              color: "#fff",
            },
            "&:hover": {
              color: "#fff",
            }
          }
        }}
      >
        <Tab 
          value="TEST_SERIES" 
          label="Prelims Test Series" 
          sx={{ 
            alignItems: "flex-start", 
            textTransform: "none",
          }} 
        />
        <Tab 
          value="PYQS" 
          label="PYQ Series" 
          sx={{ 
            alignItems: "flex-start", 
            textTransform: "none",
          }} 
        />
      </Tabs>

      <Divider sx={{ 
        my: 3,
        backgroundColor: "rgba(255, 255, 255, 0.12)" 
      }} />

      {/* Action Buttons */}
      <Stack spacing={2}>
        <Button
          variant="outlined"
          fullWidth
          endIcon={<ArrowForwardIos />}
          onClick={handleFreeCouncellingCall}
          sx={{
            justifyContent: "space-between",
            textTransform: "none",
            py: 1.5,
            color: "#fff",
            borderColor: "rgba(255, 255, 255, 0.23)",
            "&:hover": {
              borderColor: "#fff",
              backgroundColor: "rgba(255, 255, 255, 0.08)"
            }
          }}
        >
          Book a Consultation Call
        </Button>
        <Button
          variant="outlined"
          fullWidth
          endIcon={<ArrowForwardIos />}
          onClick={handleMentorshipAppointment}
          sx={{
            justifyContent: "space-between",
            textTransform: "none",
            py: 1.5,
            color: "#fff",
            borderColor: "rgba(255, 255, 255, 0.23)",
            "&:hover": {
              borderColor: "#fff",
              backgroundColor: "rgba(255, 255, 255, 0.08)"
            }
          }}
        >
          Book an Appointment
        </Button>
      </Stack>

      <Box sx={{ mt: "auto", pt: 2 }}>
        <Button
          startIcon={<MdLogout style={{ color: "#FF3D3D" }} />}
          onClick={handleLogout}
          sx={{
            color: "#FF3D3D",
            textTransform: "none",
            justifyContent: "flex-start",
            width: "100%",
            "&:hover": {
              backgroundColor: "rgba(255, 61, 61, 0.08)"
            }
          }}
        >
          Log Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#000",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              position: "relative",
              height: "100vh",
              borderRight: "none",
              backgroundColor: "#000",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;