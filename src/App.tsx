import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  CardMedia,
  Select,
  MenuItem,
  FormControl,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState, useCallback } from "react";
import { fetchSteamGameDetails, getGameDeals, searchGamesByTitle } from "./services";
import type { SteamGameData } from "./services/steamApi";
import type { StoreDeal, SearchResult } from "./services";
import "./popup.css";

type Currency = "USD" | "BRL" | "EUR";

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  BRL: "R$",
  EUR: "€",
};

const CURRENCY_RATES: Record<Currency, number> = {
  USD: 1,
  BRL: 5.0,
  EUR: 0.92,
};

function convertPrice(priceUSD: string | undefined | null, currency: Currency): string {
  if (!priceUSD) return "N/A";
  const numPrice = parseFloat(priceUSD);
  if (isNaN(numPrice)) return priceUSD;
  const converted = numPrice * CURRENCY_RATES[currency];
  return `${CURRENCY_SYMBOLS[currency]}${converted.toFixed(2)}`;
}

interface GameCardProps {
  result: SearchResult;
  currency: Currency;
  isExpanded: boolean;
  onToggle: () => void;
  onOpenDeal: (url: string) => void;
}

function GameCard({ result, currency, isExpanded, onToggle, onOpenDeal }: GameCardProps) {
  return (
    <Card
      sx={{
        bgcolor: isExpanded ? "#252a3d" : "#1f2937",
        borderRadius: 2,
        border: `1px solid ${isExpanded ? "#667eea" : "#374151"}`,
        overflow: "hidden",
        transition: "all 0.3s ease",
        boxShadow: isExpanded ? "0 4px 20px rgba(102,126,234,0.3)" : "none",
        mb: 1.5,
      }}
    >
      <Box
        onClick={onToggle}
        sx={{
          display: "flex",
          gap: 2,
          p: 2,
          cursor: "pointer",
          "&:hover": { bgcolor: "rgba(102,126,234,0.1)" },
        }}
      >
        {result.thumb && (
          <CardMedia
            component="img"
            sx={{
              width: 70,
              height: 70,
              borderRadius: 1.5,
              objectFit: "cover",
            }}
            image={result.thumb}
            alt={result.title}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <CardContent sx={{ flex: 1, py: 0, "&:last-child": { pb: 0 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="white"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {result.title}
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#4ade80", mt: 0.5 }}>
                {convertPrice(result.cheapest, currency)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                size="small"
                label={`${result.deals.length} lojas`}
                sx={{
                  bgcolor: "#374151",
                  color: "#9ca3af",
                  fontSize: "0.7rem",
                }}
              />
              <IconButton
                size="small"
                sx={{
                  color: isExpanded ? "#667eea" : "#9ca3af",
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "all 0.3s ease",
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Box>

      {isExpanded && (
        <Box sx={{ bgcolor: "#1a1f2e", borderTop: "1px solid #374151" }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="#9ca3af" sx={{ mb: 1.5 }}>
              Preços em outras lojas:
            </Typography>
            {result.deals.length === 0 ? (
              <Alert severity="info" sx={{ bgcolor: "#252a3d", color: "#9ca3af" }}>
                Nenhuma oferta encontrada nesta loja
              </Alert>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {result.deals.map((deal, dealIndex) => (
                  <Box
                    key={dealIndex}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      bgcolor: "#252a3d",
                      borderRadius: 1.5,
                      px: 1.5,
                      py: 1,
                      border: "1px solid #374151",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="bold" color="white">
                        {deal.storeName}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: "#4ade80" }}>
                          {convertPrice(deal.price, currency)}
                        </Typography>
                        {deal.retailPrice && deal.price && parseFloat(deal.retailPrice) > parseFloat(deal.price) && (
                          <Typography
                            variant="caption"
                            sx={{ textDecoration: "line-through", color: "#6b7280" }}
                          >
                            {convertPrice(deal.retailPrice, currency)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {deal.savings > 0 && (
                        <Chip
                          size="small"
                          label={`-${Math.round(deal.savings)}%`}
                          sx={{
                            bgcolor: "#dc2626",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.7rem",
                            height: 22,
                          }}
                        />
                      )}
                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDeal(deal.dealUrl);
                        }}
                        sx={{
                          bgcolor: "#667eea",
                          "&:hover": { bgcolor: "#5a6fd6" },
                          fontSize: "0.75rem",
                          py: 0.5,
                        }}
                      >
                        Ver oferta
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            <Button
              fullWidth
              variant="outlined"
              size="small"
              endIcon={<OpenInNewIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onOpenDeal(`https://store.steampowered.com/app/${result.steamAppID}`);
              }}
              sx={{
                mt: 2,
                borderColor: "#667eea",
                color: "#667eea",
                "&:hover": {
                  borderColor: "#5a6fd6",
                  bgcolor: "rgba(102,126,234,0.1)",
                },
                fontSize: "0.75rem",
              }}
            >
              Ver na Steam
            </Button>
          </Box>
        </Box>
      )}
    </Card>
  );
}

const App = () => {
  const [game, setGame] = useState<SteamGameData | null>(null);
  const [deals, setDeals] = useState<StoreDeal[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchingDeals, setSearchingDeals] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currency, setCurrency] = useState<Currency>("BRL");
  const [expandedGame, setExpandedGame] = useState<string | null>(null);

  const toggleGame = useCallback((title: string) => {
    setExpandedGame((prev) => (prev === title ? null : title));
  }, []);

  useEffect(() => {
    function fetchGameFromStorage() {
      chrome.storage.local.get("currentGame", (result) => {
        if (result.currentGame) {
          setGame(result.currentGame);
        }
      });
    }

    function onStorageChanged(
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) {
      if (areaName === "local" && changes.currentGame) {
        setGame(changes.currentGame.newValue || null);
      }
    }

    fetchGameFromStorage();
    chrome.storage.onChanged.addListener(onStorageChanged);

    return () => {
      chrome.storage.onChanged.removeListener(onStorageChanged);
    };
  }, []);

  useEffect(() => {
    async function requestGameInfo() {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tabs.length === 0) {
        setGame(null);
        setDeals([]);
        return;
      }

      const tab = tabs[0];
      if (!tab.url || !tab.url.includes("store.steampowered.com/app/")) {
        setGame(null);
        setDeals([]);
        return;
      }

      chrome.tabs.sendMessage(
        tab.id!,
        { type: "CHECK_STEAM" },
        async (response) => {
          if (chrome.runtime.lastError) {
            setError("Não foi possível conectar à página da Steam");
            return;
          }

          if (response && response.data && response.data.appId) {
            setLoading(true);
            setError(null);
            setIsSearching(false);
            setSearchResults([]);
            setExpandedGame(null);

            try {
              const steamData = await fetchSteamGameDetails(response.data.appId);
              if (steamData) {
                setGame(steamData);
                chrome.storage.local.set({ currentGame: steamData });

                const gameDeals = await getGameDeals(response.data.appId.toString());
                setDeals(gameDeals);
              } else {
                setError("Jogo não encontrado na Steam");
              }
            } catch {
              setError("Erro ao buscar dados do jogo");
            } finally {
              setLoading(false);
            }
          }
        }
      );
    }
    requestGameInfo();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchingDeals(true);
    setLoading(true);
    setError(null);
    setIsSearching(true);
    setGame(null);
    setDeals([]);
    setExpandedGame(null);

    try {
      const results = await searchGamesByTitle(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        setError("Nenhum resultado encontrado. Tente outro nome.");
      }
    } catch {
      setError("Erro ao buscar ofertas");
    } finally {
      setSearchingDeals(false);
      setLoading(false);
    }
  };

  const openDealLink = (url: string) => {
    chrome.tabs.create({ url });
  };

  return (
    <Box
      sx={{
        width: 440,
        minHeight: 650,
        bgcolor: "#1a1a2e",
        color: "#e0e0e0",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      <Box
        sx={{
          p: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="h6" fontWeight="bold" color="white">
            Game Deals
          </Typography>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              sx={{
                bgcolor: "rgba(255,255,255,0.15)",
                color: "white",
                fontSize: "0.85rem",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" },
                "& .MuiSvgIcon-root": { color: "white" },
              }}
            >
              <MenuItem value="USD">USD $</MenuItem>
              <MenuItem value="BRL">BRL R$</MenuItem>
              <MenuItem value="EUR">EUR €</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Buscar jogo (ex: Elden Ring)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(255,255,255,0.95)",
                borderRadius: 2,
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "transparent" },
                "&.Mui-focused fieldset": { borderColor: "transparent" },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={searchingDeals}
            sx={{
              bgcolor: "#ff6b6b",
              "&:hover": { bgcolor: "#ee5a5a" },
              borderRadius: 2,
              px: 3,
              minWidth: "auto",
            }}
          >
            {searchingDeals ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 2, flex: 1, overflowY: "auto", bgcolor: "#16213e" }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#667eea" }} size={40} />
          </Box>
        )}

        {error && !loading && (
          <Alert
            severity="warning"
            sx={{
              bgcolor: "rgba(255,107,107,0.1)",
              color: "#ff6b6b",
              border: "1px solid rgba(255,107,107,0.3)",
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {isSearching && searchResults.length > 0 && (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="#667eea" mb={2}>
              Resultados para "{searchQuery}"
            </Typography>
            {searchResults.map((result, index) => (
              <GameCard
                key={`${result.steamAppID}-${index}`}
                result={result}
                currency={currency}
                isExpanded={expandedGame === result.title}
                onToggle={() => toggleGame(result.title)}
                onOpenDeal={openDealLink}
              />
            ))}
          </Box>
        )}

        {game && !isSearching && (
          <>
            <Typography variant="h6" fontWeight="bold" color="#667eea" mb={2}>
              {game.name}
            </Typography>
            {game.price && (
              <Card
                sx={{
                  bgcolor: "#1f2937",
                  borderRadius: 2,
                  border: "1px solid #374151",
                  mb: 2,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="body2" color="#9ca3af">
                        Preço na Steam
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ color: "white" }}>
                          {game.price.finalFormatted}
                        </Typography>
                        {game.price.discountPercent > 0 && (
                          <Chip
                            size="small"
                            label={`-${game.price.discountPercent}%`}
                            sx={{
                              bgcolor: "#dc2626",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() => openDealLink(`https://store.steampowered.com/app/${game.appId}`)}
                      sx={{ color: "#60a5fa" }}
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            )}
            {game.isFree && (
              <Chip
                size="small"
                label="GRÁTIS"
                sx={{ bgcolor: "#059669", color: "white", mb: 2 }}
              />
            )}

            {deals.length > 0 && (
              <>
                <Typography variant="subtitle1" fontWeight="bold" color="#667eea" mb={1}>
                  Melhores ofertas:
                </Typography>
                {deals.slice(0, 8).map((deal, i) => (
                  <Card
                    key={i}
                    sx={{
                      bgcolor: "#1f2937",
                      borderRadius: 2,
                      border: "1px solid #374151",
                      mb: 1,
                      "&:hover": { borderColor: "#667eea" },
                    }}
                  >
                    <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography variant="body1" fontWeight="bold" color="white">
                            {deal.storeName}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: "#4ade80" }}>
                          {convertPrice(deal.price, currency)}
                            </Typography>
                            {deal.retailPrice && deal.price && parseFloat(deal.retailPrice) > parseFloat(deal.price) && (
                              <Typography
                                variant="body2"
                                sx={{ textDecoration: "line-through", color: "#6b7280" }}
                              >
                            {convertPrice(deal.retailPrice, currency)}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {deal.savings > 0 && (
                            <Chip
                              size="small"
                              label={`-${Math.round(deal.savings)}%`}
                              sx={{
                                bgcolor: "#dc2626",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            />
                          )}
                          <Button
                            variant="contained"
                            size="small"
                            endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                            onClick={() => openDealLink(deal.dealUrl)}
                            sx={{
                              bgcolor: "#667eea",
                              "&:hover": { bgcolor: "#5a6fd6" },
                            }}
                          >
                            Ver oferta
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </>
        )}

        {!game && !loading && !error && !isSearching && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" color="#9ca3af">
              Pesquise um jogo para ver as promoções em várias lojas
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: "#374151" }} />
      <Box sx={{ p: 1.5, textAlign: "center", bgcolor: "#111827" }}>
        <Typography variant="caption" color="#6b7280">
          © 2025 Danilo Gomes | Powered by CheapShark
        </Typography>
      </Box>
    </Box>
  );
};

export default App;
