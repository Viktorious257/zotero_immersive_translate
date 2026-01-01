const DEFAULT_PREFS = {
  apiUrl: "https://libretranslate.de/translate",
  targetLang: "zh",
  sourceLang: "auto",
};

async function getPrefs() {
  const prefs = await browser.storage.local.get(DEFAULT_PREFS);
  return {
    apiUrl: prefs.apiUrl || DEFAULT_PREFS.apiUrl,
    targetLang: prefs.targetLang || DEFAULT_PREFS.targetLang,
    sourceLang: prefs.sourceLang || DEFAULT_PREFS.sourceLang,
  };
}

async function translateText(text) {
  const { apiUrl, targetLang, sourceLang } = await getPrefs();
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: "text",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HTTP ${response.status}: ${body}`);
  }

  const payload = await response.json();
  return payload.translatedText || "";
}

function getSelectedText(win) {
  try {
    const selection = win.getSelection?.();
    const selectionText = selection ? selection.toString().trim() : "";
    if (selectionText) {
      return selectionText;
    }
  } catch (error) {
    Zotero.debug(`Immersive Translate selection error: ${error}`);
  }
  return "";
}

async function promptAndTranslate(win) {
  const selectionText = getSelectedText(win);
  const input = selectionText || win.prompt("輸入要翻譯的內容", "");
  if (!input) {
    return;
  }

  try {
    const translated = await translateText(input);
    win.alert(translated || "(沒有翻譯結果)");
  } catch (error) {
    win.alert(`翻譯失敗：${error.message}`);
  }
}

function ensureMenuItem(win) {
  const doc = win.document;
  const toolsPopup = doc.getElementById("menu_ToolsPopup");
  if (!toolsPopup) {
    return;
  }

  if (doc.getElementById("immersive-translate-menuitem")) {
    return;
  }

  const menuItem = doc.createXULElement("menuitem");
  menuItem.setAttribute("id", "immersive-translate-menuitem");
  menuItem.setAttribute("label", "沉浸式翻譯");
  menuItem.addEventListener("command", () => promptAndTranslate(win));
  toolsPopup.appendChild(menuItem);
}

async function init() {
  const win = Zotero.getMainWindow();
  if (!win) {
    return;
  }

  if (win.document.readyState === "complete") {
    ensureMenuItem(win);
    return;
  }

  win.addEventListener(
    "load",
    () => {
      ensureMenuItem(win);
    },
    { once: true }
  );
}

init();
