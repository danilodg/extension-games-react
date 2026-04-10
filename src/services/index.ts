export { type SteamGameData, type SteamApiResponse, fetchSteamGameDetails } from "./steamApi";

export { 
  type StoreDeal, 
  type CheapSharkDeal, 
  type StoreInfo,
  type SearchResult,
  searchGameOnCheapShark, 
  getGameDeals, 
  getDealsByTitle,
  searchGamesByTitle,
  getDealUrl
} from "./cheapSharkApi";
