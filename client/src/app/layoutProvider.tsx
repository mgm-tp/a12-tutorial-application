import * as React from "react";
import { useSelector } from "react-redux";

import { FrameFactories, FrameViews } from "@com.mgmtp.a12.client/client-core/lib/core/frame";
import { UaaOidcModifiedUser, UaaSelectors, UserInfoHeader } from "@com.mgmtp.a12.uaa/uaa-authentication-client";

import { RESOURCE_KEYS, useLocalizer } from "../localization";
import LocaleChooser from "../components/LocaleChooser";
import { getUserPermissions } from "../modules/utils";

export const customLayoutProvider: FrameViews.LayoutProvider = (name: string) => {
    // "ApplicationFrame" is the hardcoded layout name taken from the App Model and is the default for the Client.
    return name === "ApplicationFrame"
        ? { component: CustomApplicationFrameLayout }
        : FrameFactories.layoutProvider(name);
};

/**
 * The ApplicationFrameLayout is used in the root region of the application and defines its base structure.
 *
 * This CustomApplicationFrameLayout uses the default layout and extends it by adding header items (LocaleChooser, UserInfoHeader).
 *
 * @param props Check {@link ApplicationFrameLayoutProps} for all available properties to customize.
 * @return JSX.Element The application layout.
 */
function CustomApplicationFrameLayout(props: FrameViews.ApplicationFrameLayoutProps): JSX.Element {
    const localizer = useLocalizer();
    const user = useSelector(UaaSelectors.user) as UaaOidcModifiedUser;

    return (
        <FrameViews.ApplicationFrameLayout
            {...props}
            permissions={getUserPermissions(user)}
            additionalHeaderItems={[
                {
                    item: <LocaleChooser />,
                    orientation: "rightSlots-left"
                },
                {
                    item: (
                        <UserInfoHeader
                            mobileMode={false}
                            loggedInAsLabel={localizer(RESOURCE_KEYS.application.header.userinfo.labels.loggedInAs)}
                            logoutButtonLabel={localizer(RESOURCE_KEYS.application.header.userinfo.labels.logoutButton)}
                        />
                    ),
                    orientation: "rightSlots-left"
                }
            ]}
        />
    );
}
