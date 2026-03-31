import type { PropsWithChildren, ReactNode } from "react";
import { useSelector } from "react-redux";

import { AuthenticationState, UaaSelectors, LoginPage, UaaClient } from "@com.mgmtp.a12.uaa/uaa-authentication-client";

export const AuthBarrier = ({ children }: PropsWithChildren): ReactNode => {
    const authenticatedState = useSelector(UaaSelectors.state);
    const isAuthenticated = authenticatedState === AuthenticationState.AUTHENTICATED;

    if (!isAuthenticated) {
        return <LoginPage imageURL={"/images/login_bg.jpg"} uaaClient={UaaClient.getLocalClient()} />;
    }

    return children;
};
