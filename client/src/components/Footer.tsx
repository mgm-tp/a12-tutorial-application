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

import type { ReactElement } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";

import { ApplicationActions } from "@com.mgmtp.a12.client/client-core";
import { GeneralColorsConfig, Link } from "@com.mgmtp.a12.widgets/widgets-core";

import { useLocalizer } from "../localization";
import { defaultPage, pages } from "../modules/help/pages";

const StyledFooter = styled.div(({ theme }) => {
    return css`
        border-top: 1px solid ${theme.colors.divider.color};
        background: ${GeneralColorsConfig.white};
        min-height: 60px;
        display: flex;
        gap: ${theme.spacing.baseSpacing.BASE}px;
        align-items: center;
        padding: ${theme.spacing.horizontalSpacing.horizWhiteSpacinglg}px;
    `;
});

export default function Footer(): ReactElement {
    const dispatch = useDispatch();
    const localizer = useLocalizer();

    const footerPages = Object.keys(pages);

    const onFooterItemClick = (page: string) => {
        dispatch(
            ApplicationActions.startMainActivityRequested({
                descriptor: {
                    module: "Help",
                    ...(page !== defaultPage ? { page } : {})
                }
            })
        );
    };

    return (
        <StyledFooter>
            {footerPages.map((page) => (
                <Link key={page} onClick={() => onFooterItemClick(page)}>
                    {localizer(`application.footer.${page}`)}
                </Link>
            ))}
        </StyledFooter>
    );
}
