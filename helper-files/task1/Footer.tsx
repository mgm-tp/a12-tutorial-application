import React, { ReactElement } from "react";
import styled, { css } from "styled-components";

import { GeneralColorsConfig } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base";

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
	return <StyledFooter></StyledFooter>;
}
