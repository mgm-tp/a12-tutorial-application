import React, { ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { View } from "@com.mgmtp.a12.client/client-core/lib/core/view";
import { LocaleSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/locale";
import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity";

import { pages } from "../pages";

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
    const { activityId } = props;
    const activity = useSelector(ActivitySelectors.activityById(activityId))!;
    const page = activity.descriptor.page ?? "help";
    const locale = useSelector(LocaleSelectors.locale());

    return (
        <ContentPage>
            <ReactMarkdown>{pages[page][locale.language]}</ReactMarkdown>
        </ContentPage>
    );
}
