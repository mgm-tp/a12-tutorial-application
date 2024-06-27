import type { LocalizationKeyTreeType } from "../keys";

export const de_DE: LocalizationKeyTreeType = {
    application: {
        title: "Kundenbeziehungsmanagement",
        header: {
            userinfo: {
                labels: {
                    loggedInAs: "Angemeldet als",
                    logoutButton: "Ausloggen"
                }
            }
        },
        footer: {
            help: "Hilfe",
            faq: "FAQ"
        }
    },

    locale: {
        en: "Englisch (EN)",
        de: "Deutsch (DE)"
    },

    contact: {
        form: {
            screen: {
                daysUntilBirthday: "Der Geburtstag des Kontakts ist in $daysNum$ Tag(en).",
                birthdayToday: "Der Geburtstag des Kontakts ist heute!"
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
