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

import { type ComponentType, useCallback } from "react";

import { Button, ModalNotification } from "@com.mgmtp.a12.widgets/widgets-core";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization";
import { LoggerFactory } from "@com.mgmtp.a12.utils/utils-logging";

import { DEFAULT_TRANSLATIONS } from "../localization";
import { en_US } from "../localization/resources/en_US";
import type { LocalizationKeyTreeType } from "../localization/keys";
import { isObject } from "../utils/guards";

const logger = LoggerFactory.getLogger("PT/server-unavailable");

export const LOCALE_LOCAL_STORAGE_KEY = "locale";

function isLocalizationKeyTree(tree: unknown): tree is LocalizationKeyTreeType {
    return isObject(tree) && "error" in tree;
}

function getTranslations(): LocalizationKeyTreeType {
    try {
        const localeString = localStorage.getItem(LOCALE_LOCAL_STORAGE_KEY) ?? "en";
        const language = Locale.fromString(localeString).language;
        const tree = DEFAULT_TRANSLATIONS[language];

        if (isLocalizationKeyTree(tree)) {
            return tree;
        }
    } catch {
        logger.warn("Failed to get translations from localStorage or Locale.fromString");
    }
    return en_US;
}

export const ServerUnavailableNotification: ComponentType = function () {
    const { title, message, retry } = getTranslations().error.serverUnavailable;
    const handleRetry = useCallback(() => globalThis.location.reload(), []);

    return (
        <ModalNotification variant="error" title={title} footer={<Button label={retry} onClick={handleRetry} />}>
            <p>{message}</p>
        </ModalNotification>
    );
};
