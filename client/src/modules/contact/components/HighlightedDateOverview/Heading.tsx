import { ReactElement, PropsWithChildren, Dispatch, SetStateAction } from "react";

import { Heading } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/view/components/heading";
import { DefaultComponentMap } from "@com.mgmtp.a12.overviewengine/overviewengine-core/lib/main/view/configuration/component-map";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon";

interface HeadingProps extends PropsWithChildren<Heading.PropsType> {
    isHighlighted: boolean;
    setIsHighlighted: Dispatch<SetStateAction<boolean>>;
}

export default function Heading({ isHighlighted, setIsHighlighted, ...headingProps }: HeadingProps): ReactElement {
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
