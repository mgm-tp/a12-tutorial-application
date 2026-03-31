import { useSelector } from "react-redux";
import type { ReactElement } from "react";

import { FrameViews } from "@com.mgmtp.a12.client/client-core";
import { UaaSelectors, UserInfoHeader } from "@com.mgmtp.a12.uaa/uaa-authentication-client";

import { RESOURCE_KEYS, useLocalizer } from "../localization";
import ThemeChooser from "../components/ThemeChooser";

/**
 * The ApplicationFrameLayout is used in the root region of the application and defines its base structure.
 *
 * This CustomApplicationFrameLayout uses the default layout and extends it by adding header items (LocaleChooser, UserInfoHeader).
 *
 * @param props Check {@link ApplicationFrameLayoutProps} for all available properties to customize.
 * @return ReactElement The application layout.
 */
export function CustomApplicationFrameLayout(props: FrameViews.ApplicationFrameLayoutProps): ReactElement {
    const localizer = useLocalizer();
    const roles = useSelector(UaaSelectors.roles)?.map((role) => role.name);

    return (
        <FrameViews.ApplicationFrameLayout
            {...props}
            permissions={roles}
            additionalHeaderItems={[
                ...(props.additionalHeaderItems ?? []),
                {
                    item: <ThemeChooser />,
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
