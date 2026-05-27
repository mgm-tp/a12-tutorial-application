/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

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
