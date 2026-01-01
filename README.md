# Zotero Immersive Translate

這是一個 Zotero 的翻譯插件範例，目標是提供類似 Chrome「沉浸式翻譯」的體驗，讓你可以在 Zotero 中快速翻譯選取文字或手動輸入內容。

## 功能

- 在「工具」選單新增「沉浸式翻譯」入口。
- 優先翻譯目前視窗中選取的文字，沒有選取內容時會提示輸入。
- 預設使用 LibreTranslate 公開 API，支援自訂 API 位址與語言。

## 安裝方式 (Zotero 7)

1. 將本專案打包成 `.xpi` (實際上是 zip 檔)。
2. 在 Zotero 內選擇「工具」→「外掛程式」→齒輪→「從檔案安裝外掛程式」，選取 `.xpi`。

## 偏好設定

插件會使用 `browser.storage.local` 儲存偏好，可在 Zotero 的開發者主控台中執行：

```js
browser.storage.local.set({
  apiUrl: "https://libretranslate.de/translate",
  targetLang: "zh",
  sourceLang: "auto",
});
```

## 注意事項

- 公開 API 可能有頻率或服務限制，可改成自架的 LibreTranslate 或其他翻譯 API。
- 若要做出更完整的「沉浸式翻譯」閱讀體驗，可以再加入：
  - PDF/EPUB 閱讀器覆蓋層。
  - 雙語段落對照視圖。
  - 自動語言偵測與批次翻譯。
