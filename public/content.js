let currentGameInfo = null;

function extractSteamAppId() {
  const url = window.location.href;
  const match = url.match(/\/app\/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function extractGameInfo() {
  const appId = extractSteamAppId();
  const gameName = document.querySelector(".apphub_AppName")?.textContent || "";
  
  let priceText = "Preço não disponível";
  const priceElement = document.querySelector(".game_purchase_price, .discount_original_price");
  if (priceElement) {
    priceText = priceElement.textContent?.trim() || "Preço não disponível";
  }

  currentGameInfo = { 
    appId: appId,
    gameName: gameName, 
    price: priceText 
  };
}

window.addEventListener("load", () => {
  setTimeout(extractGameInfo, 1000);
  chrome.runtime.sendMessage({ type: "GAME_INFO", data: currentGameInfo });
});

const observer = new MutationObserver(() => {
  if (document.querySelector(".apphub_AppName")) {
    extractGameInfo();
    chrome.runtime.sendMessage({ type: "GAME_INFO", data: currentGameInfo });
  }
});

observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CHECK_STEAM") {
    if (!currentGameInfo) {
      extractGameInfo();
    }
    sendResponse({ type: "GAME_INFO", data: currentGameInfo });
    return true;
  }
  if (message.type === "GET_APP_ID") {
    const appId = extractSteamAppId();
    sendResponse({ type: "APP_ID", appId: appId });
    return true;
  }
});
