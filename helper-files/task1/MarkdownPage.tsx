import type { ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { LocaleSelectors, type View } from "@com.mgmtp.a12.client/client-core";

import { defaultPage, pages } from "../pages";

const ContentPage = styled.div`
	max-width: 900px;
	display: block;
	margin: 0 auto;
	img {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}
`;

export default function MarkdownPage(props: View): ReactElement | null {
	// TODO: Get the current locale from Redux, replacing the following line
	const locale = { language: "en" };

	const page = defaultPage;

	return (
		<ContentPage>
			<ReactMarkdown>{pages[page]?.[locale.language]}</ReactMarkdown>
		</ContentPage>
	);
}
