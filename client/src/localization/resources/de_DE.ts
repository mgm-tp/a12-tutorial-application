import type { LocalizationKeyTreeType } from "../keys";

export const de_DE: LocalizationKeyTreeType = {
    customerType: {
        lead: "Leitung",
        inactive: "Inaktiv",
        vip: "VIP",
        suspended: "Suspendiert",
        partner: "Partner",
        null: "Keine Angabe"
    },

    dashboard: {
        title: "Kunden nach Typ",
        chart: "Kunden",
        noData: "Keine Daten"
    },

    notification: {
        reload: {
            success: {
                title: "Neuladen war erfolgreich",
                message: "Die Daten wurden erfolgreich neugeladen."
            },
            error: {
                title: "Neuladen ist fehlgeschlagen",
                message: "Die Daten konnten nicht erfolgreich neugeladen werden."
            }
        }
    },

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
