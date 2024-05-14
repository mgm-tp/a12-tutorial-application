import { Container } from "@com.mgmtp.a12.client/client-core/lib/core/configuration";

import { supportedLocales } from "../localization";

Container.config.bind(Container.identifier.Locales).toConstantValue(supportedLocales);
