import { createTheme, Theme } from '@mui/material/styles';

// declare module '@mui/material/styles' {
//   interface PaletteColor {
//     accent?: string; 
//   }

//   interface SimplePaletteColorOptions {
//     accent?: string; 
//   }

//   interface Palette {
//     tertiary: PaletteColor;
//   }

//   interface PaletteOptions {
//     tertiary?: SimplePaletteColorOptions; 
//   }
// }

const theme: Theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: "#111111",
    },
    text: {
      primary: '#201f1e',
      secondary: "#6A6464",
    },
  },
  
});

export default theme;
