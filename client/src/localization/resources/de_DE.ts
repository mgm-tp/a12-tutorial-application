import { LocalizationKeyTreeType } from "../keys";

export const de_DE: LocalizationKeyTreeType = {
    application: {
        title: "Your-Project-Name",
        header: {
            userinfo: {
                labels: {
                    loggedInAs: "Angemeldet als",
                    logoutButton: "Ausloggen"
                }
            }
        },
        model: {
            appmodel: {
                loading: {
                    error: {
                        title: "Application Model Fehler",
                        message: "Beim Laden des Application Models ist ein Fehler aufgetreten."
                    }
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
