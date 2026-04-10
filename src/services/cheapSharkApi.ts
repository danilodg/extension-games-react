export interface StoreDeal {
  storeID: string;
  dealID: string;
  price: string;
  retailPrice: string;
  savings: number;
  storeName: string;
  storeIcon: string;
  dealUrl: string;
}

export function getDealUrl(dealID: string): string {
  return `https://www.cheapshark.com/redirect?dealID=${dealID}`;
}

export async function searchGameOnCheapShark(gameName: string): Promise<CheapSharkDeal[]> {
  try {
    const response = await fetch(
      `https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(gameName)}&limit=5`
    );
    const games = await response.json();
    return games;
  } catch (error) {
    console.error("Erro ao buscar jogo no CheapShark:", error);
    return [];
  }
}

export async function getGameDeals(steamAppId: string): Promise<StoreDeal[]> {
  try {
    const response = await fetch(
      `https://www.cheapshark.com/api/1.0/games?id=${steamAppId}`
    );
    const data = await response.json();

    if (!data.deals) {
      return [];
    }

    const storesResponse = await fetch("https://www.cheapshark.com/api/1.0/stores");
    const stores: StoreInfo[] = await storesResponse.json();
    const storeMap = new Map(stores.map(s => [s.storeID, s]));

    return data.deals.map((deal: {
      storeID: string;
      dealID: string;
      price: string;
      retailPrice: string;
      savings: string;
    }) => ({
      storeID: deal.storeID,
      dealID: deal.dealID,
      price: deal.price,
      retailPrice: deal.retailPrice,
      savings: parseFloat(deal.savings),
      storeName: storeMap.get(deal.storeID)?.storeName || "Loja Desconhecida",
      storeIcon: storeMap.get(deal.storeID)?.images?.icon || "",
      dealUrl: getDealUrl(deal.dealID),
    }));
  } catch (error) {
    console.error("Erro ao buscar ofertas:", error);
    return [];
  }
}

export async function getDealsByTitle(gameName: string, limit: number = 10): Promise<StoreDeal[]> {
  try {
    const games = await searchGameOnCheapShark(gameName);
    
    if (games.length === 0) {
      return [];
    }

    const allDeals: StoreDeal[] = [];
    
    for (const game of games.slice(0, 3)) {
      const deals = await getGameDeals(game.steamAppID);
      allDeals.push(...deals);
    }

    return allDeals
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      .slice(0, limit);
  } catch (error) {
    console.error("Erro ao buscar ofertas por título:", error);
    return [];
  }
}

export interface SearchResult {
  title: string;
  steamAppID: string;
  cheapest: string;
  cheapestStore: string;
  thumb: string;
  deals: StoreDeal[];
}

export async function searchGamesByTitle(title: string): Promise<SearchResult[]> {
  try {
    const games = await searchGameOnCheapShark(title);
    
    if (games.length === 0) {
      return [];
    }

    const results: SearchResult[] = [];

    for (const game of games.slice(0, 8)) {
      const deals = await getGameDeals(game.steamAppID);
      results.push({
        title: game.title,
        steamAppID: game.steamAppID,
        cheapest: game.cheapest || deals[0]?.price || "N/A",
        cheapestStore: deals[0]?.storeName || "Várias lojas",
        thumb: game.thumb,
        deals: deals.slice(0, 5),
      });
    }

    return results;
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    return [];
  }
}
