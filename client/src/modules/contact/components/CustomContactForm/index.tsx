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

import { type ReactElement, useContext } from "react";

import type { View } from "@com.mgmtp.a12.client/client-core";
import {
    DefaultFormModelMap,
    DefaultWidgetMap,
    type FormModelMap,
    FormEngineViews,
    type WidgetMap
} from "@com.mgmtp.a12.formengine/formengine-core";
import { SizeContext } from "@com.mgmtp.a12.widgets/widgets-core";

import ContactFormControl from "./ContactFormControl";
import ContactFormScreen from "./ContactFormScreen";
import ContactFormTextField from "./ContactFormTextField";

export default function CustomContactForm(props: View): ReactElement {
    const { currentSize } = useContext(SizeContext);
    const isSmallScreenSize = currentSize === "xs" || currentSize === "sm";

    return (
        <FormEngineViews.FormEngine
            {...props}
            formModelMap={ContactFormFormModelMap}
            widgetMap={ContactFormWidgetMap}
            cardView={isSmallScreenSize}
        />
    );
}

export const ContactFormFormModelMap: FormModelMap = {
    ...DefaultFormModelMap,
    Control: {
        component(controlProps) {
            return <ContactFormControl {...controlProps} />;
        }
    },
    Screen: {
        component(screenProps) {
            return <ContactFormScreen {...screenProps} />;
        }
    }
};

export const ContactFormWidgetMap: WidgetMap = {
    ...DefaultWidgetMap,
    TextField(textFieldProps) {
        return <ContactFormTextField {...textFieldProps} />;
    }
};
