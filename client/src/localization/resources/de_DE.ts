import { LocalizationKeyTreeType } from "../keys";

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
