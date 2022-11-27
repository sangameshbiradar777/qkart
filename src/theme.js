import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: ["Nunito", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      light: "#a17179",
      main: "#8a4d58",
      dark: "#995662",
      contrastText: "#fff",
    },
  },
});

export default theme;
