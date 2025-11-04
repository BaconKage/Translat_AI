// src/utils/translationService.ts

import { translateWithDictionary } from "./dictionary";
import { detectLanguage } from "./languageDetection";

// Public demo endpoint – ok for testing
const LIBRE_TRANSLATE_URL = "https://libretranslate.de/translate";

/**
 * Main entry that the rest of your app calls.
 * We translate the WHOLE text in ONE request to avoid 429 / rate limits.
 */
export const translateText = async (
  text: string,
  settings: { sourceLang: string; targetLang: string },
  setProcessingProgress: (value: number) => void
): Promise<string> => {
  const { sourceLang, targetLang } = settings;

  if (!text || !text.trim()) {
    return "";
  }

  // step 1: detect language if needed
  setProcessingProgress(5);
  let finalSource = sourceLang;
  if (sourceLang === "auto") {
    try {
      finalSource = await detectLanguage(text);
    } catch {
      finalSource = "en";
    }
  }

  // step 2: try to translate with API
  setProcessingProgress(25);
  const translated = await translateWithLibre(text, finalSource, targetLang);

  // step 3: done
  setProcessingProgress(100);
  return translated;
};

/**
 * Try LibreTranslate once.
 * If it fails, we fall back to dictionary / original text.
 */
const translateWithLibre = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> => {
  try {
    const res = await fetch(LIBRE_TRANSLATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.translatedText) {
        return data.translatedText;
      }
    } else {
      // e.g. 429 or 4xx
      console.warn("LibreTranslate responded with:", res.status);
    }
  } catch (err) {
    console.warn("LibreTranslate failed:", err);
  }

  // if we reach here, API didn’t give us anything useful
  // fall back to dictionary, and if that’s not helpful, return original text
  const dict = translateWithDictionary(text, sourceLang, targetLang);
  return dict || text;
};
