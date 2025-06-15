import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import "./popup.css";

type GameInfo = {
  gameName: string;
  price: string;
};

const mockPrices = [
  { site: "Nuuvem", price: "R$39,90" },
  { site: "Green Man Gaming", price: "R$35,00" },
  { site: "Humble Bundle", price: "R$37,50" },
];

const App = () => {
  const [game, setGame] = useState<GameInfo | null>(null);

  useEffect(() => {
    // Função para buscar dados do storage e atualizar estado
    function fetchGameFromStorage() {
      chrome.storage.local.get("currentGame", (result) => {
        if (result.currentGame) {
          setGame(result.currentGame);
        } else {
          setGame(null);
        }
      });
    }

    fetchGameFromStorage();

    // Escuta alterações no storage para atualizar em tempo real
    function onStorageChanged(changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string) {
      if (areaName === "local" && changes.currentGame) {
        setGame(changes.currentGame.newValue || null);
      }
    }

    chrome.storage.onChanged.addListener(onStorageChanged);

    // Cleanup
    return () => {
      chrome.storage.onChanged.removeListener(onStorageChanged);
    };
  }, []);


  useEffect(() => {
    async function requestGameInfo() {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs.length === 0) {
        setGame(null);
        return;
      }
      const tab = tabs[0];
      if (!tab.url || !tab.url.includes("store.steampowered.com/app/")) {
        setGame(null);
        return;
      }
      chrome.tabs.sendMessage(tab.id!, { type: "CHECK_STEAM" }, (response) => {
        if (chrome.runtime.lastError) {
          setGame(null);
          return;
        }
        if (response && response.type === "GAME_INFO" && response.data) {
          setGame(response.data);
        } else {
          setGame(null);
        }
      });
    }
    requestGameInfo();
  }, []);



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
        {game ? (
          <>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Jogo atual: {game.gameName}
            </Typography>
            <Typography variant="body2" mb={2}>
              Preço na Steam: {game.price}
            </Typography>

            <Typography variant="subtitle2" fontWeight="bold" mb={1}>
              Mais barato em:
            </Typography>

            {mockPrices.map((site, i) => (
              <Card key={i} sx={{ display: "flex", mb: 1, borderRadius: 2 }}>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="body1">{site.site}</Typography>
                  <Typography variant="body2" color="success.main">
                    {site.price}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <Typography variant="body2">
            Acesse a página de um jogo na Steam para ver as promoções.
          </Typography>
        )}
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
