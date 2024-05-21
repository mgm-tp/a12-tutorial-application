import React from "react";

import { Heading } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/view/components/heading";
import { DefaultComponentMap } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/view/configuration/component-map";
import { Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

interface HeadingProps extends React.PropsWithChildren<Heading.PropsType> {
    isHighlighted: boolean;
    setIsHighlighted: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Heading({
    isHighlighted,
    setIsHighlighted,
    ...headingProps
}: HeadingProps): React.ReactElement {
    const handleClick = () => {
        setIsHighlighted((prevIsHighlighted) => !prevIsHighlighted);
    };

    return (
        <>
            <DefaultComponentMap.Heading {...headingProps} />
            <div className="-u-flex -u-items-center -u-justify-end -u-padding-x-xl -u-margin-y-sm">
                <Button
                    onClick={handleClick}
                    primary
                    icon={<Icon size="big">{!isHighlighted ? "highlight" : "highlight_off"}</Icon>}
                />
            </div>
        </>
    );
}
