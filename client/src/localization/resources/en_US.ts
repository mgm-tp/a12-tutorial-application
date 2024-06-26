import { LocalizationKeyTreeType } from "../keys";

export const en_US: LocalizationKeyTreeType = {
    application: {
        title: "Customer Relationship Management",
        header: {
            userinfo: {
                labels: {
                    loggedInAs: "Logged in as",
                    logoutButton: "Logout"
                }
            }
        },
        footer: {
            help: "Help",
            faq: "FAQ"
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
