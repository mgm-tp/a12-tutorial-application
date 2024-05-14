import { UserManager } from "oidc-client-ts";

function createUserManager(config) {
    return new UserManager(config);
}

function processSilentRenew() {
    const authenticationType = sessionStorage.getItem("authenticationType");
    if (authenticationType === "OAUTH2") {
        const mgr = createUserManager({});
        mgr.signinSilentCallback();
    }
}

processSilentRenew();
