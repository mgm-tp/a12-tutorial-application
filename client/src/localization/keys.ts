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

import { initializeKeys } from "@com.mgmtp.a12.utils/utils-localization";
import { DIRTY_HANDLING_RESOURCE_KEYS } from "@com.mgmtp.a12.client/client-core/dirtyHandling";
import { HETEROGENEITY_RESOURCE_KEYS } from "@com.mgmtp.a12.client/client-core/heterogeneity";
import {
    FRAME_RESOURCE_KEYS,
    LOCALE_RESOURCE_KEYS,
    LOCALE_SELECT_RESOURCE_KEYS
} from "@com.mgmtp.a12.client/client-core";
import { RESOURCE_KEYS as FORMENGINE_RESOURCE_KEYS } from "@com.mgmtp.a12.formengine/formengine-core";
import { RESOURCE_KEYS as OVERVIEWENGINE_RESOURCE_KEYS } from "@com.mgmtp.a12.overviewengine/overviewengine-core";
import { RESOURCE_KEYS as TREEENGINE_RESOURCE_KEYS } from "@com.mgmtp.a12.treeengine/treeengine-core";
import {
    CDM_RESOURCE_KEYS,
    RELATIONSHIP_RESOURCE_KEYS
} from "@com.mgmtp.a12.relationshipengine/relationshipengine-core";
import { CRUD_RESOURCE_KEYS } from "@com.mgmtp.a12.crud/crud-core";

/**
 * This mapping provides the key-structure for all custom labels and texts which shall be localized.
 *
 * The key-value pairs for each locale can be found under the 'resources' folder.
 */
export const RESOURCE_KEYS = {
    application: {
        header: {
            userinfo: {
                labels: {
                    loggedInAs: "",
                    logoutButton: ""
                }
            }
        }
    },

    locale: {
        en: "",
        de: ""
    },

    error: {
        security: {
            notAuthorized: {
                description: ""
            }
        },
        attachment: {
            invalidType: ""
        },
        "content-store": {
            content: {
                invalidSize: ""
            }
        },
        serverUnavailable: {
            title: "",
            message: "",
            retry: ""
        }
    }
};

initializeKeys(RESOURCE_KEYS);

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

/** Creates a typing for a localization tree map with A12 localizable keys. */
export type LocalizationKeyTreeType = typeof RESOURCE_KEYS &
    DeepPartial<typeof CDM_RESOURCE_KEYS> &
    DeepPartial<typeof CRUD_RESOURCE_KEYS> &
    DeepPartial<typeof DIRTY_HANDLING_RESOURCE_KEYS> &
    DeepPartial<typeof FRAME_RESOURCE_KEYS> &
    DeepPartial<typeof HETEROGENEITY_RESOURCE_KEYS> &
    DeepPartial<typeof LOCALE_RESOURCE_KEYS> &
    DeepPartial<typeof LOCALE_SELECT_RESOURCE_KEYS> &
    DeepPartial<typeof RELATIONSHIP_RESOURCE_KEYS> &
    DeepPartial<typeof FORMENGINE_RESOURCE_KEYS> &
    DeepPartial<typeof TREEENGINE_RESOURCE_KEYS> &
    DeepPartial<typeof OVERVIEWENGINE_RESOURCE_KEYS>;
