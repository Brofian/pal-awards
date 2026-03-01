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
            "error": {
                "username_unavailable": "Dieser Benutzername wird bereits verwendet",
                "email_unavailable": "Diese E-Mail Adresse wird bereits verwendet",
            }
        },
        "login": {
            "error": {
                "failed": "Passwort oder Benutzername falsch",
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