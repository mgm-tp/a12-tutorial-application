import { LocalizationKeyTreeType } from "../keys";

export const en_US: LocalizationKeyTreeType = {
    application: {
        title: "A12 Tutorial Application",
        header: {
            userinfo: {
                labels: {
                    loggedInAs: "Logged in as",
                    logoutButton: "Logout"
                }
            }
        },
        model: {
            appmodel: {
                loading: {
                    error: {
                        title: "Application Model error",
                        message: "An error occurred while loading application model."
                    }
                }
            }
        },
        footer: {
            help: "Help",
            faq: "FAQ"
        }
    },
    contact: {
        form: {
            screen: {
                daysUntilBirthday: "The contact's birthday is in $daysNum$ day(s).",
                birthdayToday: "The contact's birthday is today!"
            }
        }
    },
    error: {
        security: {
            notAuthorized: {
                description: "You are not allowed to perform the requested operation."
            }
        },
        attachment: {
            invalidType: "Invalid MIME type."
        },
        "content-store": {
            content: {
                invalidSize: "The attachment content exceeds the maximum permitted size."
            }
        }
    }
};
