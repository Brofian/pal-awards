import {type AvailableLanguageKey, languageMap, type TranslationSchema} from "./lang/LanguageMap";

// Two dot-concatenated strings
type DotPrefix<T extends string, P extends string> = `${P}.${T}`;

// Recursive search for the strings in the translation object by following the first-segment of the dot-string
type TranslationPaths<T> = {
    [K in keyof T]: T[K] extends object
        ? DotPrefix<TranslationPaths<T[K]>, Extract<K, string>>
        : Extract<K, string>;
}[keyof T];

// The actually available keys for the translation schema
export type TranslationKey = TranslationPaths<TranslationSchema>;


/**
 * Translate a dot separated key and replace any placeholders inside
 */
export function translate(
    key: TranslationKey,
    data?: { [key: string]: string } | undefined,
    lang?: AvailableLanguageKey
): string {
    const translation = (lang && languageMap[lang]) || languageMap['de_DE'];

    let translatedString = translateDotKey(translation, key);
    if (data) {
        for (const [key, value] of Object.entries(data)) {
            translatedString = translatedString.replaceAll(`%${key}%`, value);
        }
    }
    return translatedString;
}

/**
 * Translate a dot separated key by walking down the path in the given object
 */
function translateDotKey<
    T extends Record<string, unknown>,
    K extends TranslationPaths<T>
>(obj: T, key: K): string {
    const parts = key.split(".");
    let result: unknown = obj;

    for (const part of parts) {
        if (typeof result !== "object" || result === null) {
            throw new Error(`Invalid translation path: ${key}`);
        }

        // After the check above we can now safely ascribe the current result
        result = (result as Record<string, unknown>)[part];
    }

    if (typeof result !== "string") {
        throw new Error(`Invalid translation path: ${key}`);
    }

    return result;
}