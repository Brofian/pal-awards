import GermanTranslation from "./de_DE";

export const languageMap = {
    "de_DE": GermanTranslation
} as const;

// All keys of available languages (e.g. de_DE)
export type AvailableLanguageKey = keyof typeof languageMap;

export type TranslationSchema = {
    "title": string,
    "404": string,
    "debug": {
        "websocket": string,
        "connected": string,
        "disconnected": string,
    }
}