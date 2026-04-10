export interface SteamGameData {
  name: string;
  appId: number;
  isFree: boolean;
  price: {
    currency: string;
    initial: number;
    final: number;
    discountPercent: number;
    finalFormatted: string;
  } | null;
}

export interface SteamApiResponse {
  success: boolean;
  data?: SteamGameData;
}

export async function fetchSteamGameDetails(appId: number, cc: string = "br"): Promise<SteamGameData | null> {
  try {
    const response = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=${cc}&l=portuguese`
    );
    const data = await response.json();

    if (!data || !data[appId] || !data[appId].success) {
      return null;
    }

    const gameData = data[appId].data;

    return {
      name: gameData.name,
      appId: appId,
      isFree: gameData.is_free || false,
      price: gameData.price_overview ? {
        currency: gameData.price_overview.currency,
        initial: gameData.price_overview.initial,
        final: gameData.price_overview.final,
        discountPercent: gameData.price_overview.discount_percent,
        finalFormatted: gameData.price_overview.final_formatted,
      } : null,
    };
  } catch (error) {
    console.error("Erro ao buscar dados da Steam:", error);
    return null;
  }
}
