// src/utils/translationService.ts

import { translateWithDictionary } from "./dictionary";
import { detectLanguage } from "./languageDetection";

// 🌍 Primary APIs
const LIBRE_TRANSLATE_URL = "https://libretranslate.de/translate";
const MYMEMORY_URL = "https://api.mymemory.translated.net/get";

// ⚙️ Main translation function
export const translateText = async (
  text: string,
  settings: { sourceLang: string; targetLang: string },
  setProcessingProgress: (value: number) => void
): Promise<string> => {
  const { sourceLang, targetLang } = settings;
  const chunks = text.match(/.{1,300}/g) || [text];
  const translatedChunks: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i].trim().replace(/\s+/g, " ");
    const translated = await translateWithAPI(chunk, sourceLang, targetLang);
    translatedChunks.push(translated);
    setProcessingProgress(Math.round(((i + 1) / chunks.length) * 100));
  }

  return translatedChunks.join(" ");
};

// 🌐 API handler
const translateWithAPI = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> => {
  // Try LibreTranslate first
  try {
    const res = await fetch(LIBRE_TRANSLATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang === "auto" ? "en" : sourceLang,
        target: targetLang,
        format: "text",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.translatedText) return data.translatedText;
    }
  } catch (err) {
    console.warn("LibreTranslate failed, trying MyMemory…", err);
  }

  // Fallback: MyMemory API
  try {
    const res = await fetch(
      `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`,
      { method: "GET", headers: { Accept: "application/json" } }
    );

    if (res.ok) {
      const data = await res.json();
      if (
        data.responseStatus === 200 &&
        data.responseData &&
        data.responseData.translatedText
      ) {
        return data.responseData.translatedText;
      }
    }
  } catch (err) {
    console.warn("MyMemory failed:", err);
  }

  // Last fallback: local dictionary
  return translateWithDictionary(text, sourceLang, targetLang);
};
