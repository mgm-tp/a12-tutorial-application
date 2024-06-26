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
        },
        footer: {
            help: "Hilfe",
            faq: "FAQ"
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
