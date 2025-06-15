import { Box, Button, Typography, Paper } from "@mui/material";

const App = () => {
  return (
    <Box
      sx={{
        minHeight: "200px",
        minWidth: "300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Paper elevation={3} sx={{ p: 2, textAlign: "center", width: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Olá! 👋
        </Typography>
        <Typography variant="body1" gutterBottom>
          Bem-vindo à extensão!
        </Typography>
        <Button variant="contained" color="primary">
          Clique aqui
        </Button>
      </Paper>
    </Box>
  );
};

export default App;
