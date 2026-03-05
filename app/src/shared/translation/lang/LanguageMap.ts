import GermanTranslation from "./de_DE";

export const languageMap = {
    "de_DE": GermanTranslation
} as const;

// All keys of available languages (e.g. de_DE)
export type AvailableLanguageKey = keyof typeof languageMap;

export type TranslationSchema = {
    "title": string,
    "404": string,
    "generic_error": string,
    "debug": {
        "websocket": string,
        "connected": string,
        "disconnected": string,
    },
    "auth": {
        "registration": {
            "title": string;
            "login_instead": string;
            "error": {
                "email_unavailable": string,
                "email_empty": string,
                "username_unavailable": string,
                "username_empty": string,
                "password_empty": string,
                "password_malformed": string;
            },
            "fields": {
                "username_label": string;
                "username_placeholder": string;
                "email_label": string;
                "email_placeholder": string;
                "password_label": string;
                "password_placeholder": string;
                "submit_text": string;
            }
        },
        "login": {
            "title": string;
            "register_instead": string;
            "error": {
                "failed": string,
                "username_empty": string,
                "password_empty": string,
            },
            "fields": {
                "username_label": string;
                "username_placeholder": string;
                "password_label": string;
                "password_placeholder": string;
                "submit_text": string;
            }
        }
    },
    "mail": {
        "verification": {
            "subject": string,
            "contentPlain": string,
            "contentHTML": string,
        }
    }
}