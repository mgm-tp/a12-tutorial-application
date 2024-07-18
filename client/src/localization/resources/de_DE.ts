import { LocalizationKeyTreeType } from "../keys";

export const de_DE: LocalizationKeyTreeType = {
    application: {
        title: "A12 Tutorial Application",
        header: {
            userinfo: {
                labels: {
                    loggedInAs: "Angemeldet als",
                    logoutButton: "Ausloggen"
                }
            }
        }
    },
    error: {
        security: {
            notAuthorized: {
                description: "Sie haben keine Berechtigung diese Operation durchzuführen."
            }
        },
        attachment: {
            invalidType: "Ungültiger MIME-Typ."
        },
        "content-store": {
            content: {
                invalidSize: "Der Attachment-Inhalt überschreitet die zulässige Maximalgröße."
            }
        }
    }
};
