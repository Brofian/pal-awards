import {type TranslationSchema} from "./LanguageMap";

const Translation: TranslationSchema = {
    "title": "Pal-Awards",
    "404": "404 - Nicht gefunden",
    "generic_error": "Internal server error",
    "debug": {
        "websocket": "WebSocket",
        "connected": "Connected",
        "disconnected": "Disconnected",
    },
    "auth": {
        "registration": {
            "title": "Registrieren",
            "login_instead": "Oder logge dich hier ein!",
            "error": {
                "username_unavailable": "Dieser Benutzername wird bereits verwendet",
                "email_unavailable": "Diese E-Mail Adresse wird bereits verwendet",
                "email_empty": "Bitte gib eine E-Mail Adresse an",
                "username_empty": "Bitte gib einen Benutzernamen an",
                "password_empty": "Bitte gib ein Passwort an",
                "password_malformed": "Das Passwort muss mindestens 3 Zeichen lang sein"
            },
            "fields": {
                "username_label": "Benutzername",
                "username_placeholder": "User1234",
                "email_label": "E-Mail",
                "email_placeholder": "example@mail.de",
                "password_label": "Passwort",
                "password_placeholder": "********",
                "submit_text": "Registrieren",
            }
        },
        "login": {
            "title": "Einloggen",
            "register_instead": "Oder registriere dich hier neu!",
            "error": {
                "failed": "Passwort oder Benutzername falsch",
                "password_empty": "Bitte gib ein Passwort an",
                "username_empty": "Bitte gib einen Benutzernamen an",
            },
            "fields": {
                "username_label": "Benutzername",
                "username_placeholder": "User1234",
                "password_label": "Passwort",
                "password_placeholder": "********",
                "submit_text": "Login",
            }
        }
    },
    "mail": {
        "verification": {
            "subject": "Verifizierung als %username%",
            "contentPlain": "Hey!\n" +
                "Für deinen Account %username% ist noch eine E-Mail-Verifizierung notwendig!\n" +
                "Bitte nutze dafür einfach diesen Link:\n" +
                "    %verificationLink% \n" +
                "\n" +
                "Das warst gar nicht du?\n" +
                "Dann kannst du diese E-Mail einfach ignorieren. Bitte öffne in diesem Fall NICHT den oben stehenden Link.",
            "contentHTML": "<p>Hey!" +
                "Für deinen Account <b>%username%</b> ist noch eine E-Mail-Verifizierung notwendig!<br />" +
                "Bitte nutze dafür einfach diesen Link:<br />" +
                "<a href='%verificationLink%'>%verificationLink%</a><br />" +
                "</p><p>" +
                "Das warst gar nicht du?<br /> " +
                "Dann kannst du diese E-Mail einfach ignorieren. Bitte öffne in diesem Fall NICHT den oben stehenden Link." +
                "</p>"
        }
    }
}

export default Translation;