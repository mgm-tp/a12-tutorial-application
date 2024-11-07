/* eslint-disable @typescript-eslint/no-explicit-any */
import { composeWithDevTools, EnhancerOptions } from "@redux-devtools/extension";

import { ComposeEnhancer } from "@com.mgmtp.a12.client/client-core/lib/core/application";
import { GeneratedCodeAccessorFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade";

export const enableReduxDevTools = (): ComposeEnhancer | undefined => {
    return composeWithDevTools(enhancerOptions());
};

const enhancerOptions = (): EnhancerOptions => {
    return {
        name: "A12 Client",
        serialize: FIX_devtoolsReviverActivation({
            replacer,
            reviver
        }) as EnhancerOptions["serialize"]
    };

    function replacer(_: any, value: any) {
        if (value?.constructor.name === "GeneratedScriptCodeAccessor" && Object.keys(value).includes("script")) {
            return {
                script: value["script"],
                __serializedType__: "GeneratedScriptCodeAccessor"
            };
        } else {
            return value;
        }
    }

    function reviver(_: any, value: any) {
        if (typeof value === "object" && value !== null && "__serializedType__" in value) {
            switch (value.__serializedType__) {
                case "GeneratedScriptCodeAccessor":
                    return new GeneratedCodeAccessorFactory().createScriptAccessor(value.script);
                default:
                    return value;
            }
        } else {
            return value;
        }
    }
};

// FIXME: This is an fix for enable calling reviver again via usage of immutable flag.
//  Root cause:
//   * See https://github.com/reduxjs/redux-devtools/issues/1115
//   * redux-devtools in current version 3.3.2 have a bug that prevents calling reviver when immutable flag is not set
//  Hotfix:
//  To hotfix this issue we extend the serialize object of devtools options by immutable flag.
//  This will not have any side-effects since immutable is only used by redux devtools internal
//  reviver and replacer functions which are not taken into account when custom replacer and reviver are set
const FIX_devtoolsReviverActivation = (serializeObject: Record<string, unknown>): Record<string, unknown> => {
    return { immutable: {}, ...serializeObject };
};
