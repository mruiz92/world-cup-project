import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#1976d2",
      },
    },

    shape: {
      borderRadius: 12,
    },

    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(6px)",
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 10,
          },
        },
      },
    },
  });