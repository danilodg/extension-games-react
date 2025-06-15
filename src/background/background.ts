// background.js
function notifyTab(tabId: number) {
  // Atualiza badge no ícone da extensão
  chrome.action.setBadgeText({ text: "!", tabId });
  chrome.action.setBadgeBackgroundColor({ color: "#4caf50", tabId });
}

// Quando uma aba é atualizada
chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
  if (change.status === "complete" && tab.url?.includes("store.steampowered.com/app/")) {
    notifyTab(tabId);
  }
});

// Quando o usuário muda de aba
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url?.includes("store.steampowered.com/app/")) {
      notifyTab(activeInfo.tabId);
    }
  });
});

// Aqui você adiciona o listener para receber mensagens do content script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "GAME_INFO") {
    console.log("Dados do jogo recebidos no background:", message.data);
    chrome.storage.local.set({ currentGame: message.data });
  }
});

      