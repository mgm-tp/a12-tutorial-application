import React, { ReactElement } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";

import { ApplicationActions } from "@com.mgmtp.a12.client/client-core/lib/core/application";
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";
import { GeneralColorsConfig } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base";

import { useLocalizer } from "../localization";
import { pages } from "../modules/help/pages";

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
                    page
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
