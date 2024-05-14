import { SagaIterator } from "redux-saga";
import { put, takeLatest } from "typed-redux-saga";
import { actionCreatorFactory } from "typescript-fsa";

import { StoreActions } from "@com.mgmtp.a12.client/client-core/lib/core/store";
import { Locale, PartialLocale } from "@com.mgmtp.a12.utils/utils-localization/lib/main";

const factory = actionCreatorFactory("UAA/LOCALE");

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LocaleActions {
    /**
     * Change the current locale to the given locale
     */
    export const set = factory<Locale | PartialLocale>("SET");
}

export function* setLanguageSelectedInLoginForm(): SagaIterator {
    yield* takeLatest(StoreActions.resetState.match, setLocale);

    function* setLocale(): SagaIterator {
        const localeLocalStorage = Locale.fromString(localStorage.getItem("locale") ?? "en_Us");
        yield* put(LocaleActions.set(localeLocalStorage));
    }
}
