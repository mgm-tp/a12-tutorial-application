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

import type { ReactElement, PropsWithChildren, Dispatch, SetStateAction } from "react";

import { DefaultComponentMap, type Heading } from "@com.mgmtp.a12.overviewengine/overviewengine-core";
import { Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

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
