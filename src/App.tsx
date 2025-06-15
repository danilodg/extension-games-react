import { Box, Typography, TextField, Button, Divider, Card, CardContent, CardMedia } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import './popup.css';

const games = [
  {
    title: "Cyberpunk 2077",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
    discount: "50% OFF",
    price: "R$99,90 → R$49,95"
  },
  {
    title: "Red Dead Redemption 2",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
    discount: "67% OFF",
    price: "R$249,00 → R$82,17"
  },
  {
    title: "Elden Ring",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
    discount: "30% OFF",
    price: "R$259,90 → R$181,93"
  },
];

const App = () => {
  return (
    <Box
      sx={{
        width: 400,
        minHeight: 600,
        bgcolor: "background.default",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
        overflow: "hidden",
      }}
    >
      {/* Header com Pesquisa */}
      <Box sx={{ p: 2, bgcolor: "primary.main", color: "primary.contrastText" }}>
        <Typography variant="h6" fontWeight="bold">Promoções de Jogos</Typography>
        <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Pesquisar jogo"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              sx: { borderRadius: 5, bgcolor: "white" },
            }}
          />
          <Button variant="contained" color="secondary">Buscar</Button>
        </Box>
      </Box>

      {/* Conteúdo principal */}
      <Box sx={{ p: 2, flex: 1, overflowY: "auto", bgcolor: "background.paper" }}>
        {games.map((game, index) => (
          <Card key={index} sx={{ display: "flex", mb: 2, borderRadius: 2 }}>
            <CardMedia
              component="img"
              sx={{ width: 120 }}
              image={game.image}
              alt={game.title}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">{game.title}</Typography>
              <Typography variant="body2" color="success.main">{game.discount}</Typography>
              <Typography variant="body2">{game.price}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Footer */}
      <Divider />
      <Box sx={{ p: 1.5, textAlign: "center", bgcolor: "grey.100" }}>
        <Typography variant="caption">© 2025 Danilo Gomes</Typography><br />
        <Typography variant="caption">
          <a href="https://github.com/danilodg" target="_blank" rel="noreferrer">GitHub</a> |{" "}
          <a href="https://wa.me/5591999999999" target="_blank" rel="noreferrer">WhatsApp</a>
        </Typography>
      </Box>
    </Box>
  );
};

export default App;
