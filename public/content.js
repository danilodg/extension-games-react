let currentGameInfo = null;

// Função que extrai os dados da página Steam
function extractGameInfo() {
  // exemplo simples, adapte conforme sua lógica:
  const gameName = document.querySelector(".apphub_AppName")?.textContent || "";
  const price = document.querySelector(".game_purchase_price")?.textContent?.trim() || "Preço não encontrado";

  currentGameInfo = { gameName, price };
}

// Quando a página termina de carregar, extrai dados
window.addEventListener("load", () => {
  extractGameInfo();
  // Envia para o background (opcional)
  chrome.runtime.sendMessage({ type: "GAME_INFO", data: currentGameInfo });
});

// Ou, se preferir executar logo (dependendo do site)
extractGameInfo();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CHECK_STEAM") {
    // Se já tem dados extraídos, responde
    if (currentGameInfo) {
      sendResponse({ type: "GAME_INFO", data: currentGameInfo });
    } else {
      // Se não, tenta extrair e responder
      extractGameInfo();
      sendResponse({ type: "GAME_INFO", data: currentGameInfo });
    }
    // Indica que resposta é assíncrona (se quiser usar async)
    return true;
  }
});
