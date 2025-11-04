// src/utils/translationService.ts

import { translateWithDictionary } from "./dictionary";
import { detectLanguage } from "./languageDetection";

const LIBRE_TRANSLATE_URL = "https://libretranslate.de/translate"; // free public endpoint

/**
 * Main function: Translates text using LibreTranslate.
 * It’s reliable enough for demo/presentation purposes.
 */
export const translateText = async (
  text: string,
  settings: { sourceLang: string; targetLang: string },
  setProcessingProgress: (value: number) => void
): Promise<string> => {
  const { sourceLang, targetLang } = settings;
  if (!text || !text.trim()) return "";

  try {
    setProcessingProgress(10);

    // Step 1: detect source language if auto
    let detectedSource = sourceLang;
    if (sourceLang === "auto") {
      try {
        detectedSource = await detectLanguage(text);
      } catch {
        detectedSource = "en";
      }
    }

    setProcessingProgress(40);

    // Step 2: call LibreTranslate once (no chunking)
    const res = await fetch(LIBRE_TRANSLATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: detectedSource,
        target: targetLang,
        format: "text",
      }),
    });

    if (!res.ok) {
      console.warn("LibreTranslate returned error", res.status);
      return translateWithDictionary(text, detectedSource, targetLang);
    }

    const data = await res.json();
    setProcessingProgress(90);

    // Step 3: return translated text or fallback
    const output = data?.translatedText || translateWithDictionary(text, detectedSource, targetLang);

    setProcessingProgress(100);
    return output;
  } catch (err) {
    console.error("Translation error:", err);
    return translateWithDictionary(text, sourceLang, targetLang) || text;
  }
};
