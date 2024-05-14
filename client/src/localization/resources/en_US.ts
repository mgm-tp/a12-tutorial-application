import { LocalizationKeyTreeType } from "../keys";

export const en_US: LocalizationKeyTreeType = {
    application: {
        title: "Your-Project-Name",
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
